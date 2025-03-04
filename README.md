# IndexDB PCF Component for PowerApps

A PowerApps PCF component that enhances offline capabilities by leveraging IndexedDB for efficient local data storage and retrieval. This component expands PowerApps' existing offline functionality by enabling the storage and access of large collections when offline.

## Overview

This PCF component provides a robust solution for handling large datasets in PowerApps by utilizing the browser's IndexedDB storage. It's designed to work seamlessly with PowerApps' offline mode, allowing applications to maintain functionality even without network connectivity.

### Key Features

- **Enhanced Offline Support**: Store and access large collections locally
- **Efficient Data Management**: Uses IndexedDB for optimized storage and retrieval
- **Flexible Data Operations**: Support for create, read, and delete operations
- **Storage Monitoring**: Track storage usage in real-time
- **Event-Driven Updates**: Automatic notifications when data changes
- **Configurable Storage**: Customizable database and store names

## Usage

### Properties

#### Inputs
- `colName` (required): Identifier for the dataset
- `colData` (optional): String data to be stored
- `writeAction` (required): Boolean flag to determine operation type
  - `true`: Write operation
  - `false`: Read operation
- `dbName` (optional): Name of the IndexedDB database (default: "PCFStorage")
- `storeName` (optional): Name of the IndexedDB store (default: "datasets")

#### Outputs
- `lastDBChange`: Details of the last IndexedDB change
- `storageUsage`: Storage size in MB currently used
- `colDataOut`: JSON string containing `colName` and its associated results

### Special Operations

- Use `*` as `colName` to fetch all records
- Set `colData` to `null/undefined` to delete a record
- Use `*` with `null/undefined` `colData` to delete all records

## Technical Details

- **Storage Structure**: Data is stored in key-value pairs with `colName` as the primary key
- **Version Management**: Automatic database versioning and upgrades
- **Error Handling**: Robust error management for database operations
- **Event System**: Built-in event system for data change notifications
- **Storage Monitoring**: Real-time tracking of storage usage

## Benefits

1. **Improved Offline Experience**: Access large datasets without network connectivity
2. **Better Performance**: Reduced need for frequent server requests
3. **Efficient Storage**: Optimized local storage using IndexedDB
4. **Real-time Updates**: Automatic PowerApps notifications on data changes
5. **Flexible Implementation**: Configurable storage options and operations

## Requirements

- PowerApps environment
- Modern web browser with IndexedDB support
- No external service dependencies

## Version

Current version: 0.0.6

## License

This project is licensed under standard Microsoft PowerApps PCF component terms.
