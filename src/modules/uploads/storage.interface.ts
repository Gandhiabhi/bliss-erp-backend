export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface StorageProvider {
  uploadFile(file: MulterFile, folder?: string): Promise<{ url: string; key: string; size: number }>;
  deleteFile(key: string): Promise<boolean>;
}
