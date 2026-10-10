import { Injectable, BadRequestException } from '@nestjs/common';
import { StorageProvider, MulterFile } from './storage.interface.js';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

@Injectable()
export class StorageService implements StorageProvider {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads');
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'text/plain',
  ];

  constructor() {
    // Ensure upload directory exists
    fs.mkdir(this.uploadDir, { recursive: true }).catch(() => {});
  }

  async uploadFile(file: MulterFile, folder = 'general'): Promise<{ url: string; key: string; size: number }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type: ${file.mimetype}. Allowed types: ${this.allowedMimeTypes.join(', ')}`
      );
    }

    // Max 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('File exceeds maximum size limit of 10MB');
    }

    // Generate safe unique filename
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

  async deleteFile(key: string): Promise<boolean> {
    try {
      const sanitizedKey = path.normalize(key).replace(/^(\.\.[\/\\])+/, '');
      const filePath = path.join(this.uploadDir, sanitizedKey);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
