var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsArray, IsBoolean, } from 'class-validator';
export class CreateUserDto {
    email;
    password;
    firstName;
    lastName;
    phone;
    branchId;
    roleNames;
}
__decorate([
    IsEmail(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    MinLength(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "branchId", void 0);
__decorate([
    IsArray(),
    IsString({ each: true }),
    IsNotEmpty(),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "roleNames", void 0);
export class UpdateUserDto {
    firstName;
    lastName;
    phone;
    isActive;
    branchId;
    roleNames;
    password;
}
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "branchId", void 0);
__decorate([
    IsArray(),
    IsString({ each: true }),
    IsOptional(),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "roleNames", void 0);
__decorate([
    IsString(),
    IsOptional(),
    MinLength(6),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
//# sourceMappingURL=user.dto.js.map