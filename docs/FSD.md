# Functional Specification Document (FSD)

## **1. Overview**
### **1.1 Project Name:**
PowerApps Canvas PCF with IndexedDB for Offline Data Handling

### **1.2 Purpose**
This document defines the functional specifications for a **PowerApps Canvas PCF** component that utilizes **IndexedDB** for offline storage of data. The goal is to allow large datasets to be accessed efficiently without relying on Dataverse or Azure SQL for frequent reads.

### **1.3 Scope**
- Implement **IndexedDB** as a local storage solution for large datasets.
- Support Create, Read, Delete in IndexedDB.
- Allow fetching all records using `*` as a universal selector.
- Implement an **event-based system** to notify PowerApps when IndexedDB changes.
- Provide **storage size monitoring** to expose storage usage in MB.
- The PCF will be a **blank control** with no UI.

## **2. Functional Requirements**

### **2.1 Data Storage & Retrieval**
- **Store JSON data** in IndexedDB with key-value structure:
  - `colName` (Primary Key, string): Identifier for the dataset.
  - `colData` (string): The dataset content.
- **Retrieve data dynamically** without predefined schemas.
- **Fetch all records** when `*` is used as the `colName`.
- **Database Configuration:**
  - Configurable database name (default: "PCFStorage")
  - Configurable store name (default: "datasets")

### **2.2 Data Modification**
- **Insert/Update:** `put()` is used to upsert data.
- **Delete:**
  - Delete a specific dataset using `colName`.
  - Delete **all** datasets when `*` is passed.
  - If `colData` is `null/undefined`, treat it as a delete request.

### **2.3 Event-Driven Updates**
- When IndexedDB is modified, dispatch a **`dbChange` event** with details:
  - `action`: update, delete, deleteAll.
  - `colName`: Affected dataset name.
- **PCF listens** for `dbChange` and triggers `notifyOutputChanged()` to inform PowerApps.

### **2.4 Storage Monitoring**
- Monitor **storage usage** within IndexedDB.
- Expose **storage size in MB** as an output.
- PowerApps will determine the appropriate storage threshold for alerts.

## **3. Technical Design**
### **3.1 IndexedDB Operations**
#### **Database Initialization**
- Automatic database creation and version management
- Handles version conflicts and upgrades gracefully
- Creates object store if not exists during upgrades
- Implements error handling for database operations

#### **Upsert Data**
- Adds new data or updates existing records.
- Deletes the record if `colData` is null/undefined.
- Deletes all records if `colName` is "*" and `colData` is null/undefined.

#### **Retrieve Data**
- Fetch **all** records if `colName = "*"`.
- Fetch **specific** records by `colName`.

### **3.2 PowerApps Integration**
- **Expose `lastDBChange` in `getOutputs()`** to inform PowerApps of the latest update.
- **Expose `storageUsage` in `getOutputs()`** to report storage consumption.
- **Expose `colDataOut` in `getOutputs()`** as a JSON string containing `colName` and its associated results.
- **PowerApps triggers a refresh** when `notifyOutputChanged()` is called.

### **3.3 PCF Manifest Inputs & Outputs**
#### **Inputs:**
- `colName`: Identifier for the dataset (required).
- `colData`: String data to be stored (optional).
- `writeAction`: Boolean flag to determine operation type (required):
  - True: Write operation
  - False: Read operation
- `dbName`: Name of the IndexedDB database (optional, default: "PCFStorage")
- `storeName`: Name of the IndexedDB store (optional, default: "datasets")

#### **Outputs:**
- `lastDBChange`: Details of the last IndexedDB change.
- `storageUsage`: Storage size in MB currently used.
- `colDataOut`: A JSON string consisting of `colName` and its associated results, ensuring consistency whether a single `colName` or `*` is passed.

## **4. Non-Functional Requirements**
- **Performance:** IndexedDB should handle **large strings** efficiently.
- **Scalability:** Ensure **indexed queries** for fast retrieval.
- **Offline Support:** Full functionality without an internet connection.
- **Security:** Data is stored in the browser's IndexedDB but does not contain sensitive information.
- **Error Handling:** Robust error management for database operations and version conflicts.
- **Version Management:** Automatic database version management and upgrades.