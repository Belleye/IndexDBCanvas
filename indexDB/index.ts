import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class indexDB implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _notifyOutputChanged: () => void;
    private _container: HTMLDivElement;
    private _db: IDBDatabase | null = null;
    private _dbName: string = "";
    private _storeName: string = "";
    private _lastDBChange: string = "";
    private _storageUsage: number = 0;
    private _colDataOut: string = "";

    constructor() {}

    private async initDB(): Promise<void> {
        if (this._db) {
            // If db exists but store doesn't, we need to close and upgrade
            if (!this._db.objectStoreNames.contains(this._storeName)) {
                const currentVersion = this._db.version;
                this._db.close();
                this._db = null;
                // Re-open with incremented version
                return this.openDatabase(currentVersion + 1);
            } else {
                return Promise.resolve();
            }
        }

        // For first time opening, try to get existing version or start at 1
        return this.openDatabase(1);
    }

    private openDatabase(version: number): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                console.log(`Opening database ${this._dbName} with version ${version}`);
                const request = indexedDB.open(this._dbName, version);

                request.onerror = (event: Event) => {
                    const error = (event.target as IDBRequest).error;
                    console.error("Database error:", error);
                    
                    // If version error, try to open with the existing version
                    if (error?.name === "VersionError") {
                        // Get the existing version and try again
                        const existingRequest = indexedDB.open(this._dbName);
                        existingRequest.onsuccess = () => {
                            const existingVersion = existingRequest.result.version;
                            existingRequest.result.close();
                            console.log(`Retrying with existing version ${existingVersion + 1}`);
                            this.openDatabase(existingVersion + 1)
                                .then(resolve)
                                .catch(reject);
                        };
                        existingRequest.onerror = () => reject(error);
                        return;
                    }
                    
                    this._db = null;
                    reject(error);
                };

                request.onsuccess = () => {
                    this._db = request.result;
                    console.log(`${this._dbName} Database opened successfully with version ${this._db.version}`);
                    
                    // Add error handler for the database
                    this._db.onerror = (event: Event) => {
                        console.error("Database error:", (event.target as IDBRequest).error);
                        this._db = null;
                    };
                    
                    resolve();
                };

                request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                    console.log(`Database upgrade needed for ${this._dbName} from version ${event.oldVersion} to ${event.newVersion}`);
                    const db = (event.target as IDBOpenDBRequest).result;
                    
                    if (!db.objectStoreNames.contains(this._storeName)) {
                        db.createObjectStore(this._storeName, { keyPath: "colName" });
                        console.log(`Object store created: ${this._storeName} in database ${this._dbName}`);
                    }
                };
            } catch (error) {
                console.error("Error initializing database:", error);
                this._db = null;
                reject(error);
            }
        });
    }

    private async updateStorageUsage(): Promise<void> {
        if (!this._db) return;

        const transaction = this._db.transaction(this._storeName, "readonly");
        const store = transaction.objectStore(this._storeName);
        const request = store.getAll();

        return new Promise((resolve) => {
            request.onsuccess = () => {
                const totalSize = request.result.reduce((acc, item) => {
                    return acc + (JSON.stringify(item).length * 2); // Approximate size in bytes
                }, 0);
                this._storageUsage = totalSize / (1024 * 1024); // Convert to MB
                this._notifyOutputChanged();
                resolve();
            };
        });
    }

    private dispatchDBChangeEvent(action: string, colName: string): void {
        this._lastDBChange = JSON.stringify({ action, colName });
        this._notifyOutputChanged();
    }

    public async init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): Promise<void> {
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;
        
        // Get database and store names from context
        this._dbName = context.parameters.dbName.raw || "PCFStorage";
        this._storeName = context.parameters.storeName.raw || "datasets";
        
        await this.initDB();
    }

    public async updateView(context: ComponentFramework.Context<IInputs>): Promise<void> {
        try {
            const newDbName = context.parameters.dbName.raw || "PCFStorage";
            const newStoreName = context.parameters.storeName.raw || "datasets";

            // Check if database or store name has changed
            if (this._db && (newDbName !== this._dbName || newStoreName !== this._storeName)) {
                // Get current version before closing
                const currentVersion = this._db.version;
                
                // Close the existing connection
                this._db.close();
                this._db = null;
                
                // Update names
                this._dbName = newDbName;
                this._storeName = newStoreName;

                // Open with incremented version
                await this.openDatabase(currentVersion + 1);
            }

            // Ensure database is initialized
            if (!this._db) {
                await this.initDB();
            }
            
            if (!this._db) {
                throw new Error("Failed to initialize database");
            }

            const colName = context.parameters.colName.raw || "";
            const colData = context.parameters.colData.raw;
            const isWriteAction = context.parameters.writeAction.raw;

            // Only create transaction if we're doing a write operation or if we need to read
            if (!isWriteAction && !colName) {
                return;
            }

            const mode = isWriteAction ? "readwrite" : "readonly";
            try {
                const transaction = this._db.transaction(this._storeName, mode);
                const store = transaction.objectStore(this._storeName);

                // Add transaction error handling
                transaction.onerror = (event: Event) => {
                    console.error("Transaction error:", (event.target as IDBRequest).error);
                };

                // Only log transaction completion for write operations
                if (isWriteAction) {
                    transaction.oncomplete = () => {
                        console.debug("Write transaction completed");
                    };
                }

                // Handle write operations
                if (isWriteAction) {
                    if (colName === "*" && (!colData || colData.trim() === "")) {
                        await new Promise<void>((resolve, reject) => {
                            const request = store.clear();
                            request.onsuccess = () => {
                                this.dispatchDBChangeEvent("deleteAll", colName);
                                resolve();
                            };
                            request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
                        });
                    } else if (!colData || colData.trim() === "") {
                        await new Promise<void>((resolve, reject) => {
                            const request = store.delete(colName);
                            request.onsuccess = () => {
                                this.dispatchDBChangeEvent("delete", colName);
                                resolve();
                            };
                            request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
                        });
                    } else if (colName && colData && colName !== "*") {
                        await new Promise<void>((resolve, reject) => {
                            const request = store.put({ colName, colData });
                            request.onsuccess = () => {
                                this.dispatchDBChangeEvent("update", colName);
                                resolve();
                            };
                            request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
                        });
                    }
                }

                // Handle read operations
                if (!isWriteAction && colName) {
                    if (colName === "*") {
                        const request = store.getAll();
                        request.onsuccess = () => {
                            this._colDataOut = JSON.stringify(request.result);
                            this._notifyOutputChanged();
                        };
                        request.onerror = (event: Event) => {
                            console.error("Error reading all records:", (event.target as IDBRequest).error);
                        };
                    } else {
                        const request = store.get(colName);
                        request.onsuccess = () => {
                            this._colDataOut = request.result ? JSON.stringify(request.result) : "";
                            this._notifyOutputChanged();
                        };
                        request.onerror = (event: Event) => {
                            console.error("Error reading record:", (event.target as IDBRequest).error);
                        };
                    }
                }

                await this.updateStorageUsage();
            } catch (error) {
                console.error("Error in transaction:", error);
            }
        } catch (error) {
            console.error("Error in updateView:", error);
        }
    }

    public getOutputs(): IOutputs {
        return {
            lastDBChange: this._lastDBChange,
            storageUsage: this._storageUsage,
            colDataOut: this._colDataOut
        };
    }

    public destroy(): void {
        if (this._db) {
            this._db.close();
        }
    }
}
