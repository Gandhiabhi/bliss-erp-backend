import { StorageProvider, MulterFile } from './storage.interface.js';
export declare class StorageService implements StorageProvider {
    private readonly uploadDir;
    private readonly allowedMimeTypes;
    constructor();
    uploadFile(file: MulterFile, folder?: string): Promise<{
        url: string;
        key: string;
        size: number;
    }>;
    deleteFile(key: string): Promise<boolean>;
}
