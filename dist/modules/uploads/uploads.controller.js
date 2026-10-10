var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards, BadRequestException, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let UploadsController = class UploadsController {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    async upload(file, folder) {
        if (!file) {
            throw new BadRequestException('Please provide a file to upload');
        }
        return this.storageService.uploadFile(file, folder || 'general');
    }
};
__decorate([
    Post(),
    UseInterceptors(FileInterceptor('file')),
    __param(0, UploadedFile()),
    __param(1, Body('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "upload", null);
UploadsController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller('uploads'),
    __metadata("design:paramtypes", [StorageService])
], UploadsController);
export { UploadsController };
//# sourceMappingURL=uploads.controller.js.map