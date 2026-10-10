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
import { ReportsService } from './reports.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getDailyReport(user, date, branchId) {
        return this.reportsService.getDailyReport(user, date, branchId);
    }
    async getMonthlyReport(user, year, month, branchId) {
        return this.reportsService.getMonthlyReport(user, year ? Number(year) : undefined, month ? Number(month) : undefined, branchId);
    }
    async getYearlyReport(user, year, branchId) {
        return this.reportsService.getYearlyReport(user, year ? Number(year) : undefined, branchId);
    }
    async getBranchComparisonReport(user) {
        return this.reportsService.getBranchComparisonReport(user);
    }
    async getServiceUsageReport(user, branchId) {
        return this.reportsService.getServiceUsageReport(user, branchId);
    }
    async getMembershipReport(user, branchId) {
        return this.reportsService.getMembershipReport(user, branchId);
    }
};
__decorate([
    Get('daily'),
    __param(0, CurrentUser()),
    __param(1, Query('date')),
    __param(2, Query('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDailyReport", null);
__decorate([
    Get('monthly'),
    __param(0, CurrentUser()),
    __param(1, Query('year')),
    __param(2, Query('month')),
    __param(3, Query('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMonthlyReport", null);
__decorate([
    Get('yearly'),
    __param(0, CurrentUser()),
    __param(1, Query('year')),
    __param(2, Query('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getYearlyReport", null);
__decorate([
    Get('branch-comparison'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getBranchComparisonReport", null);
__decorate([
    Get('services'),
    __param(0, CurrentUser()),
    __param(1, Query('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getServiceUsageReport", null);
__decorate([
    Get('memberships'),
    __param(0, CurrentUser()),
    __param(1, Query('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMembershipReport", null);
ReportsController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('reports'),
    __metadata("design:paramtypes", [ReportsService])
], ReportsController);
export { ReportsController };
//# sourceMappingURL=reports.controller.js.map