var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, IsEmail, IsDateString, } from 'class-validator';
export class CreateStaffDto {
    name;
    staffCode;
    branchId;
    phone;
    email;
    gender;
    dateOfBirth;
    address;
    emergencyContact;
    position;
    specialization;
    joiningDate;
    notes;
    status;
    userId;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Name is required' }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "staffCode", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "branchId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "phone", void 0);
__decorate([
    IsEmail(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "email", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "gender", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "dateOfBirth", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "address", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "emergencyContact", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "position", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "specialization", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "joiningDate", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "notes", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "status", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "userId", void 0);
export class UpdateStaffDto {
    name;
    phone;
    email;
    gender;
    dateOfBirth;
    address;
    emergencyContact;
    position;
    specialization;
    joiningDate;
    notes;
    status;
    userId;
}
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "phone", void 0);
__decorate([
    IsEmail(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "email", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "gender", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "dateOfBirth", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "address", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "emergencyContact", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "position", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "specialization", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "joiningDate", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "notes", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "status", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateStaffDto.prototype, "userId", void 0);
//# sourceMappingURL=staff.dto.js.map