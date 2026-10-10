var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, IsDateString, IsEnum, } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';
export class CreateAppointmentDto {
    customerId;
    branchId;
    serviceId;
    serviceVariantId;
    staffId;
    scheduledDate;
    startTime;
    endTime;
    notes;
    status;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Customer is required' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "customerId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "branchId", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Service is required' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "serviceId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "serviceVariantId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "staffId", void 0);
__decorate([
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "scheduledDate", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Start time is required (e.g. 14:00)' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "startTime", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: 'End time is required (e.g. 15:00)' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "endTime", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "notes", void 0);
__decorate([
    IsEnum(AppointmentStatus),
    IsOptional(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "status", void 0);
export class UpdateAppointmentDto {
    serviceId;
    serviceVariantId;
    staffId;
    scheduledDate;
    startTime;
    endTime;
    status;
    notes;
}
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "serviceId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "serviceVariantId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "staffId", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "scheduledDate", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "startTime", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "endTime", void 0);
__decorate([
    IsEnum(AppointmentStatus),
    IsOptional(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "status", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "notes", void 0);
//# sourceMappingURL=appointment.dto.js.map