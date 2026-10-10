var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, IsEnum, IsArray, ValidateNested, IsDateString, } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';
export class CreatePaymentDto {
    customerId;
    branchId;
    invoiceId;
    membershipId;
    amount;
    currency;
    paymentMethod;
    transactionReference;
    paymentDate;
    notes;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Customer ID is required' }),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "customerId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "branchId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "invoiceId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "membershipId", void 0);
__decorate([
    IsNumber(),
    Min(0.01, { message: 'Payment amount must be greater than 0' }),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "currency", void 0);
__decorate([
    IsEnum(PaymentMethod),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "transactionReference", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentDate", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "notes", void 0);
export class RefundPaymentDto {
    amount;
    reason;
}
__decorate([
    IsNumber(),
    Min(0.01),
    __metadata("design:type", Number)
], RefundPaymentDto.prototype, "amount", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Reason for refund is required' }),
    __metadata("design:type", String)
], RefundPaymentDto.prototype, "reason", void 0);
export class CreateInvoiceItemDto {
    description;
    serviceId;
    quantity;
    unitPrice;
    discount;
    tax;
    currency;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "description", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "serviceId", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "quantity", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "unitPrice", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "discount", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "tax", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "currency", void 0);
export class CreateInvoiceDto {
    customerId;
    branchId;
    membershipId;
    visitId;
    issueDate;
    dueDate;
    currency;
    notes;
    items;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Customer ID is required' }),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "customerId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "branchId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "membershipId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "visitId", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "issueDate", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "currency", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "notes", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateInvoiceItemDto),
    IsNotEmpty(),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "items", void 0);
//# sourceMappingURL=payment.dto.js.map