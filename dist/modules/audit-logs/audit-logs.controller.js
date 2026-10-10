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
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let AuditLogsController = class AuditLogsController {
    auditLogsService;
    constructor(auditLogsService) {
        this.auditLogsService = auditLogsService;
    }
    async findAll(user, branchId, action, entityType, search, page, limit) {
        return this.auditLogsService.findAll(user, {
            branchId,
            action,
            entityType,
            search,
            page,
            limit,
        });
    }
};
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query('branchId')),
    __param(2, Query('action')),
    __param(3, Query('entityType')),
    __param(4, Query('search')),
    __param(5, Query('page')),
    __param(6, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AuditLogsController.prototype, "findAll", null);
AuditLogsController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('audit-logs'),
    __metadata("design:paramtypes", [AuditLogsService])
], AuditLogsController);
export { AuditLogsController };
//# sourceMappingURL=audit-logs.controller.js.map