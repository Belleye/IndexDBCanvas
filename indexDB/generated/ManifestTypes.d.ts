/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    colName: ComponentFramework.PropertyTypes.StringProperty;
    colData: ComponentFramework.PropertyTypes.StringProperty;
    writeAction: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    dbName: ComponentFramework.PropertyTypes.StringProperty;
    storeName: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    colName?: string;
    colData?: string;
    writeAction?: boolean;
    lastDBChange?: string;
    storageUsage?: number;
    colDataOut?: string;
}
