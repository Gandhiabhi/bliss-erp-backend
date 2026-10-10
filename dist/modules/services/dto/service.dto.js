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
export class CreateVariantDto {
    name;
    duration;
    price;
    currency;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateVariantDto.prototype, "name", void 0);
__decorate([
    IsNumber(),
    Min(5),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "duration", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "price", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateVariantDto.prototype, "currency", void 0);
export class UpdateVariantDto {
    name;
    duration;
    price;
    currency;
    status;
}
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateVariantDto.prototype, "name", void 0);
__decorate([
    IsNumber(),
    Min(5),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateVariantDto.prototype, "duration", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateVariantDto.prototype, "price", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateVariantDto.prototype, "currency", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateVariantDto.prototype, "status", void 0);
export class CreateServiceDto {
    code;
    name;
    categoryId;
    description;
    defaultDuration;
    defaultPrice;
    currency;
    image;
    notes;
    variants;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "code", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "categoryId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "description", void 0);
__decorate([
    IsNumber(),
    Min(5),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "defaultDuration", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "defaultPrice", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "currency", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "image", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "notes", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateVariantDto),
    IsOptional(),
    __metadata("design:type", Array)
], CreateServiceDto.prototype, "variants", void 0);
export class UpdateServiceDto {
    name;
    categoryId;
    description;
    defaultDuration;
    defaultPrice;
    currency;
    status;
    image;
    notes;
}
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "categoryId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "description", void 0);
__decorate([
    IsNumber(),
    Min(5),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "defaultDuration", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "defaultPrice", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "currency", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "status", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "image", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "notes", void 0);
export class SetBranchPriceDto {
    branchId;
    customPrice;
    currency;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SetBranchPriceDto.prototype, "branchId", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], SetBranchPriceDto.prototype, "customPrice", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SetBranchPriceDto.prototype, "currency", void 0);
export class CreateCategoryDto {
    name;
    description;
    displayOrder;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "description", void 0);
__decorate([
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateCategoryDto.prototype, "displayOrder", void 0);
//# sourceMappingURL=service.dto.js.map