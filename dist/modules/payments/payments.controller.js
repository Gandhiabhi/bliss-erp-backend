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
import { Controller, Get, Post, Param, Body, Query, UseGuards, } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto, RefundPaymentDto, CreateInvoiceDto, } from './dto/payment.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async findAllPayments(user, branchId, customerId, status, method, date, search, page, limit) {
        return this.paymentsService.findAllPayments(user, {
            branchId,
            customerId,
            status,
            method,
            date,
            search,
            page,
            limit,
        });
    }
    async findOnePayment(id, user) {
        return this.paymentsService.findOnePayment(id, user);
    }
    async createPayment(dto, user) {
        return this.paymentsService.createPayment(dto, user);
    }
    async refundPayment(id, dto, user) {
        return this.paymentsService.refundPayment(id, dto, user);
    }
    async findAllInvoices(user, branchId, customerId, status, search, page, limit) {
        return this.paymentsService.findAllInvoices(user, {
            branchId,
            customerId,
            status,
            search,
            page,
            limit,
        });
    }
    async findOneInvoice(id, user) {
        return this.paymentsService.findOneInvoice(id, user);
    }
    async createInvoice(dto, user) {
        return this.paymentsService.createInvoice(dto, user);
    }
};
__decorate([
    Get('payments'),
    __param(0, CurrentUser()),
    __param(1, Query('branchId')),
    __param(2, Query('customerId')),
    __param(3, Query('status')),
    __param(4, Query('method')),
    __param(5, Query('date')),
    __param(6, Query('search')),
    __param(7, Query('page')),
    __param(8, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findAllPayments", null);
__decorate([
    Get('payments/:id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findOnePayment", null);
__decorate([
    Post('payments'),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPayment", null);
__decorate([
    Post('payments/:id/refund'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RefundPaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "refundPayment", null);
__decorate([
    Get('invoices'),
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
], PaymentsController.prototype, "findAllInvoices", null);
__decorate([
    Get('invoices/:id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findOneInvoice", null);
__decorate([
    Post('invoices'),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateInvoiceDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createInvoice", null);
PaymentsController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller(),
    __metadata("design:paramtypes", [PaymentsService])
], PaymentsController);
export { PaymentsController };
//# sourceMappingURL=payments.controller.js.map