import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { resolveBranchId } from '../../common/utils/branch-filter.js';
import { uniqueCode } from '../../common/utils/record-codes.js';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    user: AuthenticatedUser,
    query?: {
      branchId?: string;
      customerId?: string;
      staffId?: string;
      date?: string;
      status?: string;
      search?: string;
    }
  ) {
    const effectiveBranchId = resolveBranchId(user, query?.branchId);

    const where: any = {};
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

  async findOne(id: string, user: AuthenticatedUser) {
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

  async create(dto: CreateAppointmentDto, actor: AuthenticatedUser) {
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

    if (dto.staffId) {
      const therapist = await this.prisma.staff.findUnique({ where: { id: dto.staffId } });
      if (!therapist || therapist.deletedAt || therapist.status !== 'ACTIVE') {
        throw new NotFoundException('Therapist not found');
      }
      if (therapist.branchId !== branchId) {
        throw new BadRequestException('This therapist works at another branch.');
      }
    }

    const appointmentCode = uniqueCode('APT', customer.branch.branchCode);

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

  async update(id: string, dto: UpdateAppointmentDto, actor: AuthenticatedUser) {
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

  async cancel(id: string, actor: AuthenticatedUser) {
    return this.update(id, { status: AppointmentStatus.CANCELLED }, actor);
  }

  async remove(id: string, actor: AuthenticatedUser) {
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
}
