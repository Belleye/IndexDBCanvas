# IndexedDB PCF Component for PowerApps

A PowerApps PCF component that enhances offline capabilities by leveraging IndexedDB for efficient local data storage and retrieval. This component expands PowerApps' existing offline functionality by enabling the storage and access of large collections when offline.

## Index

- [IndexedDB PCF Component for PowerApps](#indexeddb-pcf-component-for-powerapps)
  - [Index](#index)
  - [The Story Behind This Component](#the-story-behind-this-component)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Usage](#usage)
    - [Properties](#properties)
      - [Inputs](#inputs)
      - [Outputs](#outputs)
    - [Special Operations](#special-operations)
  - [Setting Up in a Canvas App](#setting-up-in-a-canvas-app)
  - [Technical Details](#technical-details)
  - [Benefits](#benefits)
  - [Requirements](#requirements)
  - [Version](#version)
  - [License](#license)
  - [Contact](#contact)

## The Story Behind This Component

Anyone who has created and offline app utilizing the `SaveData` and `LoadData` functions, no doubt have found limitations in terms of storage capacity and efficiency, particularly when handling large datasets. This component addresses these challenges by harnessing the power of IndexedDB, a web storage solution that allows for efficient data storage and retrieval even without a network connection. Meaning you won't need to rely on Dataverse to get the offline experience you need.

## Overview

This PCF component provides a robust solution for handling large datasets in PowerApps by utilizing the browser's IndexedDB storage. It's designed to work seamlessly with PowerApps' offline mode, allowing applications to maintain functionality even without network connectivity. A full solution is available in the [releases](https://github.com/PowerAppsCommunity/IndexDBCanvas/releases) section.

## Key Features

- **Enhanced Offline Support**: Store and access large collections locally.
- **Efficient Data Management**: Uses IndexedDB for optimized storage and retrieval.
- **Flexible Data Operations**: Support for create, read, and delete operations.
- **Storage Monitoring**: Track storage usage in real-time.
- **Event-Driven Updates**: Automatic notifications when data changes.
- **Configurable Storage**: Customizable database and store names.

## Usage

### Properties

#### Inputs

- `colName` (required): Identifier for the dataset.
- `colData` (optional): String (typically JSON) data to be stored.
- `writeAction` (required): Boolean flag to determine operation type:
  - `true`: Write operation.
  - `false`: Read operation.
- `dbName` (optional): Name of the IndexedDB database (default: "PCFStorage").
- `storeName` (optional): Name of the IndexedDB store (default: "datasets").

#### Outputs

- `lastDBChange`: Details of the last IndexedDB change.
- `storageUsage`: Storage size in MB currently used.
- `colDataOut`: JSON string containing `colName` and its associated results.

### Special Operations

- Use `*` as `colName` to fetch all records.
- Set `colData` to `null` or `undefined` to delete a record.
- Use `*` with `Blank()` `colData` to delete all records.

## Setting Up in a Canvas App

For detailed instructions on setting up this component in a Canvas App, see [Canvas App Setup Guide](docs/canvas-app-setup.md).

## Technical Details

- **Storage Structure**: Data is stored in key-value pairs with `colName` as the primary key.
- **Version Management**: Automatic database versioning and upgrades.
- **Error Handling**: Robust error management for database operations.
- **Event System**: Built-in event system for data change notifications.
- **Storage Monitoring**: Real-time tracking of storage usage.

## Benefits

- **Improved Offline Experience**: Access large datasets without network connectivity.
- **Better Performance**: Reduced need for frequent server requests.
- **Efficient Storage**: Optimized local storage using IndexedDB.
- **Real-time Updates**: Automatic PowerApps notifications on data changes.
- **Flexible Implementation**: Configurable storage options and operations.

## Requirements

- PowerApps environment.
- Modern web browser with IndexedDB support.
- No external service dependencies.

## Version

Current version: 0.0.6

## License

This project is licensed under MIT.

## Contact

[LinkedIn](www.linkedin.com/in/stephen-belli-7a9300a5)
