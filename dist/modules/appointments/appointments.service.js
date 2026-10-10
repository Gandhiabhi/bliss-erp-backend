var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ForbiddenException, } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { resolveBranchId } from '../../common/utils/branch-filter.js';
import { AppointmentStatus } from '@prisma/client';
let AppointmentsService = class AppointmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(user, query) {
        const effectiveBranchId = resolveBranchId(user, query?.branchId);
        const where = {};
        if (effectiveBranchId) {
            where.branchId = effectiveBranchId;
        }
        if (query?.customerId) {
            where.customerId = query.customerId;
        }
        if (query?.staffId) {
            where.staffId = query.staffId;
        }
        if (query?.status) {
            where.status = query.status;
        }
        if (query?.date) {
            const targetDate = new Date(query.date);
            const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
            where.scheduledDate = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
        if (query?.search) {
            where.OR = [
                { appointmentCode: { contains: query.search, mode: 'insensitive' } },
                { customer: { displayName: { contains: query.search, mode: 'insensitive' } } },
                { customer: { phone: { contains: query.search, mode: 'insensitive' } } },
            ];
        }
        return this.prisma.appointment.findMany({
            where,
            orderBy: [{ scheduledDate: 'asc' }, { startTime: 'asc' }],
            include: {
                customer: { select: { id: true, displayName: true, phone: true, customerCode: true } },
                service: { select: { id: true, name: true, code: true, defaultDuration: true } },
                serviceVariant: { select: { id: true, name: true, duration: true } },
                staff: { select: { id: true, name: true, position: true } },
                branch: { select: { id: true, name: true, branchCode: true, timezone: true } },
            },
        });
    }
    async findOne(id, user) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: {
                customer: true,
                service: true,
                serviceVariant: true,
                staff: true,
                branch: true,
            },
        });
        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }
        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && appointment.branchId !== user.branchId) {
            throw new ForbiddenException('Access denied to appointment from another branch');
        }
        return appointment;
    }
    async create(dto, actor) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: dto.customerId },
            include: { branch: true },
        });
        if (!customer || customer.deletedAt) {
            throw new NotFoundException('Customer not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && customer.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot book appointment for customer from another branch');
        }
        const branchId = customer.branchId;
        const branch = customer.branch;
        const count = await this.prisma.appointment.count({ where: { branchId } });
        const codePrefix = branch.branchCode ? branch.branchCode.replace(/[^a-zA-Z0-9]/g, '') : 'BR';
        const year = new Date().getFullYear();
        const appointmentCode = `APT-${codePrefix}-${year}-${String(count + 1).padStart(4, '0')}`;
        const appointment = await this.prisma.appointment.create({
            data: {
                appointmentCode,
                branchId,
                customerId: customer.id,
                serviceId: dto.serviceId,
                serviceVariantId: dto.serviceVariantId || null,
                staffId: dto.staffId || null,
                scheduledDate: new Date(dto.scheduledDate),
                startTime: dto.startTime,
                endTime: dto.endTime,
                status: dto.status || AppointmentStatus.CONFIRMED,
                notes: dto.notes,
            },
            include: {
                customer: true,
                service: true,
                serviceVariant: true,
                staff: true,
                branch: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId,
                action: 'APPOINTMENT_BOOKED',
                entityType: 'Appointment',
                entityId: appointment.id,
                afterData: {
                    code: appointmentCode,
                    customer: customer.displayName,
                    service: appointment.service.name,
                    date: appointment.scheduledDate,
                    time: `${appointment.startTime} - ${appointment.endTime}`,
                },
            },
        });
        return appointment;
    }
    async update(id, dto, actor) {
        const existing = await this.prisma.appointment.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Appointment not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && existing.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot modify appointment from another branch');
        }
        const updated = await this.prisma.appointment.update({
            where: { id },
            data: {
                serviceId: dto.serviceId !== undefined ? dto.serviceId : undefined,
                serviceVariantId: dto.serviceVariantId !== undefined ? dto.serviceVariantId || null : undefined,
                staffId: dto.staffId !== undefined ? dto.staffId || null : undefined,
                scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : undefined,
                startTime: dto.startTime !== undefined ? dto.startTime : undefined,
                endTime: dto.endTime !== undefined ? dto.endTime : undefined,
                status: dto.status !== undefined ? dto.status : undefined,
                notes: dto.notes !== undefined ? dto.notes : undefined,
            },
            include: {
                customer: true,
                service: true,
                serviceVariant: true,
                staff: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId: existing.branchId,
                action: 'APPOINTMENT_UPDATED',
                entityType: 'Appointment',
                entityId: id,
                beforeData: { status: existing.status, startTime: existing.startTime, staffId: existing.staffId },
                afterData: { status: updated.status, startTime: updated.startTime, staffId: updated.staffId },
            },
        });
        return updated;
    }
    async cancel(id, actor) {
        return this.update(id, { status: AppointmentStatus.CANCELLED }, actor);
    }
    async remove(id, actor) {
        const existing = await this.prisma.appointment.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Appointment not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && existing.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot delete appointment from another branch');
        }
        await this.prisma.appointment.delete({ where: { id } });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId: existing.branchId,
                action: 'APPOINTMENT_DELETED',
                entityType: 'Appointment',
                entityId: id,
                beforeData: {
                    code: existing.appointmentCode,
                    status: existing.status,
                    scheduledDate: existing.scheduledDate,
                },
            },
        });
        return { message: 'Appointment deleted' };
    }
};
AppointmentsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AppointmentsService);
export { AppointmentsService };
//# sourceMappingURL=appointments.service.js.map