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
import { VisitsService } from './visits.service.js';
import { CreateVisitDto, UpdateVisitStatusDto } from './dto/visit.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let VisitsController = class VisitsController {
    visitsService;
    constructor(visitsService) {
        this.visitsService = visitsService;
    }
    async findAll(user, branchId, customerId, date, status, search, page, limit) {
        return this.visitsService.findAll(user, {
            branchId,
            customerId,
            date,
            status,
            search,
            page,
            limit,
        });
    }
    async findOne(id, user) {
        return this.visitsService.findOne(id, user);
    }
    async create(dto, user) {
        return this.visitsService.create(dto, user);
    }
    async updateStatus(id, dto, user) {
        return this.visitsService.updateStatus(id, dto, user);
    }
};
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query('branchId')),
    __param(2, Query('customerId')),
    __param(3, Query('date')),
    __param(4, Query('status')),
    __param(5, Query('search')),
    __param(6, Query('page')),
    __param(7, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "findOne", null);
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateVisitDto, Object]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "create", null);
__decorate([
    Put(':id/status'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateVisitStatusDto, Object]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "updateStatus", null);
VisitsController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('visits'),
    __metadata("design:paramtypes", [VisitsService])
], VisitsController);
export { VisitsController };
//# sourceMappingURL=visits.controller.js.map