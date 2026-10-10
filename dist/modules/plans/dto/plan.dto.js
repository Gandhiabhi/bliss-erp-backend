var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, IsArray, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
export class PlanServiceItemDto {
    serviceId;
    serviceVariantId;
    quantity;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], PlanServiceItemDto.prototype, "serviceId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], PlanServiceItemDto.prototype, "serviceVariantId", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], PlanServiceItemDto.prototype, "quantity", void 0);
export class CreatePlanDto {
    code;
    name;
    branchId;
    description;
    durationDays;
    price;
    currency;
    services;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "code", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "branchId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "description", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "durationDays", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "price", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "currency", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => PlanServiceItemDto),
    __metadata("design:type", Array)
], CreatePlanDto.prototype, "services", void 0);
export class UpdatePlanDto {
    name;
    description;
    durationDays;
    price;
    currency;
    status;
    services;
}
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "description", void 0);
__decorate([
    IsNumber(),
    Min(1),
    IsOptional(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "durationDays", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "price", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "currency", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "status", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => PlanServiceItemDto),
    IsOptional(),
    __metadata("design:type", Array)
], UpdatePlanDto.prototype, "services", void 0);
//# sourceMappingURL=plan.dto.js.map