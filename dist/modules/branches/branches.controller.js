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
import { BranchesService } from './branches.service.js';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
let BranchesController = class BranchesController {
    branchesService;
    constructor(branchesService) {
        this.branchesService = branchesService;
    }
    async findAll(user, search, status) {
        return this.branchesService.findAll(user, { search, status });
    }
    async findOne(id, user) {
        return this.branchesService.findOne(id, user);
    }
    async create(dto, user) {
        return this.branchesService.create(dto, user);
    }
    async update(id, dto, user) {
        return this.branchesService.update(id, dto, user);
    }
    async remove(id, user) {
        return this.branchesService.remove(id, user);
    }
};
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query('search')),
    __param(2, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "findOne", null);
__decorate([
    Roles('SUPER_ADMIN'),
    Post(),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateBranchDto, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "create", null);
__decorate([
    Roles('SUPER_ADMIN', 'BRANCH_MANAGER'),
    Put(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateBranchDto, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "update", null);
__decorate([
    Roles('SUPER_ADMIN'),
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BranchesController.prototype, "remove", null);
BranchesController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('branches'),
    __metadata("design:paramtypes", [BranchesService])
], BranchesController);
export { BranchesController };
//# sourceMappingURL=branches.controller.js.map