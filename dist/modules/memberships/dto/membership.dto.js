var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, IsBoolean, IsArray, ValidateNested, IsDateString, IsEnum, } from 'class-validator';
import { Type } from 'class-transformer';
import { MembershipStatus, PaymentMethod } from '@prisma/client';
export class MembershipServiceAllocationDto {
    serviceId;
    serviceVariantId;
    allocatedQuantity;
    notes;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], MembershipServiceAllocationDto.prototype, "serviceId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], MembershipServiceAllocationDto.prototype, "serviceVariantId", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], MembershipServiceAllocationDto.prototype, "allocatedQuantity", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], MembershipServiceAllocationDto.prototype, "notes", void 0);
export class CreateMembershipDto {
    customerId;
    branchId;
    planTemplateId;
    isCustomPlan;
    name;
    description;
    startDate;
    endDate;
    price;
    currency;
    discount;
    tax;
    notes;
    services;
    recordPayment;
    paymentMethod;
    transactionReference;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Customer ID is required' }),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "customerId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "branchId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "planTemplateId", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateMembershipDto.prototype, "isCustomPlan", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Membership plan name is required' }),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "description", void 0);
__decorate([
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "startDate", void 0);
__decorate([
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "endDate", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateMembershipDto.prototype, "price", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "currency", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], CreateMembershipDto.prototype, "discount", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], CreateMembershipDto.prototype, "tax", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "notes", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => MembershipServiceAllocationDto),
    IsOptional(),
    __metadata("design:type", Array)
], CreateMembershipDto.prototype, "services", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateMembershipDto.prototype, "recordPayment", void 0);
__decorate([
    IsEnum(PaymentMethod),
    IsOptional(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "paymentMethod", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateMembershipDto.prototype, "transactionReference", void 0);
export class UpdateMembershipStatusDto {
    status;
    notes;
}
__decorate([
    IsEnum(MembershipStatus),
    IsNotEmpty(),
    __metadata("design:type", String)
], UpdateMembershipStatusDto.prototype, "status", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateMembershipStatusDto.prototype, "notes", void 0);
//# sourceMappingURL=membership.dto.js.map