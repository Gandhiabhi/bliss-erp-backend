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
export class CreateCustomerDto {
    firstName;
    lastName;
    displayName;
    phone;
    email;
    branchId;
    gender;
    dateOfBirth;
    nationality;
    address;
    city;
    country;
    emergencyContact;
    profileImage;
    notes;
    preferredLanguage;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'First name is required' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "firstName", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "lastName", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "displayName", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Phone number is required' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "phone", void 0);
__decorate([
    IsEmail(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "email", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "branchId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "gender", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "dateOfBirth", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "nationality", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "address", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "city", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "country", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "emergencyContact", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "profileImage", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "notes", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "preferredLanguage", void 0);
export class UpdateCustomerDto {
    firstName;
    lastName;
    displayName;
    phone;
    email;
    gender;
    dateOfBirth;
    nationality;
    address;
    city;
    country;
    emergencyContact;
    profileImage;
    notes;
    preferredLanguage;
    status;
}
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "firstName", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "lastName", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "displayName", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "phone", void 0);
__decorate([
    IsEmail(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "email", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "gender", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "dateOfBirth", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "nationality", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "address", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "city", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "country", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "emergencyContact", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "profileImage", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "notes", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "preferredLanguage", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateCustomerDto.prototype, "status", void 0);
export class AddCustomerNoteDto {
    note;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Note text cannot be empty' }),
    __metadata("design:type", String)
], AddCustomerNoteDto.prototype, "note", void 0);
//# sourceMappingURL=customer.dto.js.map