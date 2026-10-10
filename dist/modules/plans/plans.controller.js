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
import { PlansService } from './plans.service.js';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let PlansController = class PlansController {
    plansService;
    constructor(plansService) {
        this.plansService = plansService;
    }
    async findAll(user, branchId, search, status) {
        return this.plansService.findAll(user, { branchId, search, status });
    }
    async findOne(id, user) {
        return this.plansService.findOne(id, user);
    }
    async create(dto, user) {
        return this.plansService.create(dto, user);
    }
    async update(id, dto, user) {
        return this.plansService.update(id, dto, user);
    }
    async remove(id, user) {
        return this.plansService.remove(id, user);
    }
};
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query('branchId')),
    __param(2, Query('search')),
    __param(3, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "findOne", null);
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePlanDto, Object]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "create", null);
__decorate([
    Put(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePlanDto, Object]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "remove", null);
PlansController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('plans'),
    __metadata("design:paramtypes", [PlansService])
], PlansController);
export { PlansController };
//# sourceMappingURL=plans.controller.js.map