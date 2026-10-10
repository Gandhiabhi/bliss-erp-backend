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
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, } from '@nestjs/common';
import { ServicesService } from './services.service.js';
import { CreateServiceDto, UpdateServiceDto, CreateVariantDto, UpdateVariantDto, SetBranchPriceDto, CreateCategoryDto, } from './dto/service.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let ServicesController = class ServicesController {
    servicesService;
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    async getCategories() {
        return this.servicesService.getCategories();
    }
    async createCategory(dto) {
        return this.servicesService.createCategory(dto);
    }
    async findAll(user, search, categoryId, branchId) {
        return this.servicesService.findAll(user, { search, categoryId, branchId });
    }
    async findOne(id, user, branchId) {
        return this.servicesService.findOne(id, user, branchId);
    }
    async create(dto, user) {
        return this.servicesService.create(dto, user);
    }
    async update(id, dto, user) {
        return this.servicesService.update(id, dto, user);
    }
    async addVariant(id, dto, user) {
        return this.servicesService.addVariant(id, dto, user);
    }
    async updateVariant(variantId, dto, user) {
        return this.servicesService.updateVariant(variantId, dto, user);
    }
    async deleteVariant(variantId, user) {
        return this.servicesService.deleteVariant(variantId, user);
    }
    async setBranchPrice(id, dto, user) {
        return this.servicesService.setBranchPrice(id, dto, user);
    }
};
__decorate([
    Get('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "getCategories", null);
__decorate([
    Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER'),
    Post('categories'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "createCategory", null);
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query('search')),
    __param(2, Query('categoryId')),
    __param(3, Query('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Query('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "findOne", null);
__decorate([
    Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER'),
    Post(),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateServiceDto, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "create", null);
__decorate([
    Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER'),
    Put(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateServiceDto, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "update", null);
__decorate([
    Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER'),
    Post(':id/variants'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateVariantDto, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "addVariant", null);
__decorate([
    Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER'),
    Put('variants/:variantId'),
    __param(0, Param('variantId')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateVariantDto, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "updateVariant", null);
__decorate([
    Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER'),
    Delete('variants/:variantId'),
    __param(0, Param('variantId')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "deleteVariant", null);
__decorate([
    Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER'),
    Post(':id/branch-price'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SetBranchPriceDto, Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "setBranchPrice", null);
ServicesController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('services'),
    __metadata("design:paramtypes", [ServicesService])
], ServicesController);
export { ServicesController };
//# sourceMappingURL=services.controller.js.map