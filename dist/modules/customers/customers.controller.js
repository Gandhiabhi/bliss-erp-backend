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
import { CustomersService } from './customers.service.js';
import { CreateCustomerDto, UpdateCustomerDto, AddCustomerNoteDto, } from './dto/customer.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let CustomersController = class CustomersController {
    customersService;
    constructor(customersService) {
        this.customersService = customersService;
    }
    async findAll(user, branchId, search, status, page, limit) {
        return this.customersService.findAll(user, {
            branchId,
            search,
            status,
            page,
            limit,
        });
    }
    async findOne(id, user) {
        return this.customersService.findOne(id, user);
    }
    async create(dto, user) {
        return this.customersService.create(dto, user);
    }
    async update(id, dto, user) {
        return this.customersService.update(id, dto, user);
    }
    async addNote(id, dto, user) {
        return this.customersService.addNote(id, dto, user);
    }
    async remove(id, user) {
        return this.customersService.remove(id, user);
    }
};
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query('branchId')),
    __param(2, Query('search')),
    __param(3, Query('status')),
    __param(4, Query('page')),
    __param(5, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findOne", null);
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    Put(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    Post(':id/notes'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddCustomerNoteDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "addNote", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "remove", null);
CustomersController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('customers'),
    __metadata("design:paramtypes", [CustomersService])
], CustomersController);
export { CustomersController };
//# sourceMappingURL=customers.controller.js.map