var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException } from '@nestjs/common';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
let StorageService = class StorageService {
    uploadDir = path.resolve(process.cwd(), 'uploads');
    allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/pdf',
        'text/plain',
    ];
    constructor() {
        fs.mkdir(this.uploadDir, { recursive: true }).catch(() => { });
    }
    async uploadFile(file, folder = 'general') {
        if (!file) {
            throw new BadRequestException('No file provided');
        }
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(`Unsupported file type: ${file.mimetype}. Allowed types: ${this.allowedMimeTypes.join(', ')}`);
        }
        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new BadRequestException('File exceeds maximum size limit of 10MB');
        }
        const ext = path.extname(file.originalname).toLowerCase();
        const safeHash = crypto.randomBytes(16).toString('hex');
        const filename = `${safeHash}${ext}`;
        const targetFolder = path.join(this.uploadDir, folder);
        await fs.mkdir(targetFolder, { recursive: true });
        const filePath = path.join(targetFolder, filename);
        await fs.writeFile(filePath, file.buffer);
        const relativeKey = `${folder}/${filename}`;
        const publicUrl = `/uploads/${relativeKey}`;
        return {
            url: publicUrl,
            key: relativeKey,
            size: file.size,
        };
    }
    async deleteFile(key) {
        try {
            const sanitizedKey = path.normalize(key).replace(/^(\.\.[\/\\])+/, '');
            const filePath = path.join(this.uploadDir, sanitizedKey);
            await fs.unlink(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
};
StorageService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], StorageService);
export { StorageService };
//# sourceMappingURL=storage.service.js.map