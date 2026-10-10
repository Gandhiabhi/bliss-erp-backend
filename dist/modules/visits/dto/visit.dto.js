var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, IsArray, ValidateNested, IsDateString, IsEnum, } from 'class-validator';
import { Type } from 'class-transformer';
import { VisitStatus } from '@prisma/client';
export class RedeemServiceItemDto {
    serviceId;
    serviceVariantId;
    membershipServiceId;
    staffId;
    quantity;
    notes;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Service ID is required' }),
    __metadata("design:type", String)
], RedeemServiceItemDto.prototype, "serviceId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], RedeemServiceItemDto.prototype, "serviceVariantId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], RedeemServiceItemDto.prototype, "membershipServiceId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], RedeemServiceItemDto.prototype, "staffId", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], RedeemServiceItemDto.prototype, "quantity", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], RedeemServiceItemDto.prototype, "notes", void 0);
export class CreateVisitDto {
    customerId;
    branchId;
    membershipId;
    visitDate;
    checkInTime;
    notes;
    services;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Customer ID is required' }),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "customerId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "branchId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "membershipId", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "visitDate", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "checkInTime", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "notes", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => RedeemServiceItemDto),
    IsNotEmpty(),
    __metadata("design:type", Array)
], CreateVisitDto.prototype, "services", void 0);
export class UpdateVisitStatusDto {
    status;
    notes;
}
__decorate([
    IsEnum(VisitStatus),
    IsNotEmpty(),
    __metadata("design:type", String)
], UpdateVisitStatusDto.prototype, "status", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateVisitStatusDto.prototype, "notes", void 0);
//# sourceMappingURL=visit.dto.js.map