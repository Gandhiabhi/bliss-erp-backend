import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service.js';
import { MulterFile } from './storage.interface.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: MulterFile,
    @Body('folder') folder?: string
  ) {
    if (!file) {
      throw new BadRequestException('Please provide a file to upload');
    }
    return this.storageService.uploadFile(file, folder || 'general');
  }
}
