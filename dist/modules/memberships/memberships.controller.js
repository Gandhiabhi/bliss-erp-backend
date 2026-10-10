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
import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, } from '@nestjs/common';
import { MembershipsService } from './memberships.service.js';
import { CreateMembershipDto, UpdateMembershipStatusDto, } from './dto/membership.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let MembershipsController = class MembershipsController {
    membershipsService;
    constructor(membershipsService) {
        this.membershipsService = membershipsService;
    }
    async findAll(user, branchId, customerId, status, search, page, limit) {
        return this.membershipsService.findAll(user, {
            branchId,
            customerId,
            status,
            search,
            page,
            limit,
        });
    }
    async getExpiringSoon(user, days) {
        return this.membershipsService.getExpiringSoon(user, days ? Number(days) : 7);
    }
    async findOne(id, user) {
        return this.membershipsService.findOne(id, user);
    }
    async create(dto, user) {
        return this.membershipsService.create(dto, user);
    }
    async updateStatus(id, dto, user) {
        return this.membershipsService.updateStatus(id, dto, user);
    }
};
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query('branchId')),
    __param(2, Query('customerId')),
    __param(3, Query('status')),
    __param(4, Query('search')),
    __param(5, Query('page')),
    __param(6, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "findAll", null);
__decorate([
    Get('expiring-soon'),
    __param(0, CurrentUser()),
    __param(1, Query('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "getExpiringSoon", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "findOne", null);
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateMembershipDto, Object]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "create", null);
__decorate([
    Put(':id/status'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateMembershipStatusDto, Object]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "updateStatus", null);
MembershipsController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('memberships'),
    __metadata("design:paramtypes", [MembershipsService])
], MembershipsController);
export { MembershipsController };
//# sourceMappingURL=memberships.controller.js.map