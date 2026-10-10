import { StorageService } from './storage.service.js';
import { MulterFile } from './storage.interface.js';
export declare class UploadsController {
    private readonly storageService;
    constructor(storageService: StorageService);
    upload(file: MulterFile, folder?: string): Promise<{
        url: string;
        key: string;
        size: number;
    }>;
}
