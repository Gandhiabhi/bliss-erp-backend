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
let StaffService = class StaffService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(user, query) {
        const effectiveBranchId = resolveBranchId(user, query?.branchId);
        const where = {
            deletedAt: null,
        };
        if (effectiveBranchId) {
            where.branchId = effectiveBranchId;
        }
        if (query?.status) {
            where.status = query.status;
        }
        if (query?.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { staffCode: { contains: query.search, mode: 'insensitive' } },
                { position: { contains: query.search, mode: 'insensitive' } },
                { specialization: { contains: query.search, mode: 'insensitive' } },
                { phone: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.staff.findMany({
            where,
            orderBy: { name: 'asc' },
            include: {
                branch: { select: { id: true, name: true, branchCode: true, city: true } },
                user: { select: { id: true, email: true, isActive: true } },
                _count: { select: { appointments: true, visitServices: true } },
            },
        });
    }
    async findOne(id, user) {
        const staff = await this.prisma.staff.findUnique({
            where: { id },
            include: {
                branch: true,
                user: { select: { id: true, email: true, isActive: true } },
                visitServices: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        service: true,
                        visit: { include: { customer: true } },
                    },
                },
                appointments: {
                    take: 10,
                    orderBy: { scheduledDate: 'desc' },
                    include: { customer: true, service: true },
                },
            },
        });
        if (!staff || staff.deletedAt) {
            throw new NotFoundException('Staff member not found');
        }
        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && staff.branchId !== user.branchId) {
            throw new ForbiddenException('Access denied to staff in another branch');
        }
        return staff;
    }
    async create(dto, actor) {
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        let branchId = dto.branchId;
        if (!isSuperAdmin) {
            if (!actor.branchId) {
                throw new ForbiddenException('Actor has no branch assigned');
            }
            branchId = actor.branchId;
        }
        else if (!branchId) {
            const firstBranch = await this.prisma.branch.findFirst({ where: { status: 'ACTIVE' } });
            if (!firstBranch)
                throw new NotFoundException('No active branch found');
            branchId = firstBranch.id;
        }
        const count = await this.prisma.staff.count({ where: { branchId } });
        const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
        const codePrefix = branch?.branchCode ? branch.branchCode.replace(/[^a-zA-Z0-9]/g, '') : 'BR';
        const staffCode = dto.staffCode || `STF-${codePrefix}-${String(count + 1).padStart(3, '0')}`;
        const staff = await this.prisma.staff.create({
            data: {
                staffCode,
                branchId,
                name: dto.name,
                phone: dto.phone,
                email: dto.email,
                gender: dto.gender,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
                address: dto.address,
                emergencyContact: dto.emergencyContact,
                position: dto.position,
                specialization: dto.specialization,
                joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : new Date(),
                notes: dto.notes,
                status: dto.status || 'ACTIVE',
                userId: dto.userId || null,
            },
            include: {
                branch: true,
                user: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId,
                action: 'STAFF_CREATED',
                entityType: 'Staff',
                entityId: staff.id,
                afterData: staff,
            },
        });
        return staff;
    }
    async update(id, dto, actor) {
        const existing = await this.prisma.staff.findUnique({ where: { id } });
        if (!existing || existing.deletedAt) {
            throw new NotFoundException('Staff member not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && existing.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot edit staff from another branch');
        }
        const updated = await this.prisma.staff.update({
            where: { id },
            data: {
                name: dto.name !== undefined ? dto.name : undefined,
                phone: dto.phone !== undefined ? dto.phone : undefined,
                email: dto.email !== undefined ? dto.email : undefined,
                gender: dto.gender !== undefined ? dto.gender : undefined,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
                address: dto.address !== undefined ? dto.address : undefined,
                emergencyContact: dto.emergencyContact !== undefined ? dto.emergencyContact : undefined,
                position: dto.position !== undefined ? dto.position : undefined,
                specialization: dto.specialization !== undefined ? dto.specialization : undefined,
                joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : undefined,
                notes: dto.notes !== undefined ? dto.notes : undefined,
                status: dto.status !== undefined ? dto.status : undefined,
                userId: dto.userId !== undefined ? dto.userId || null : undefined,
            },
            include: {
                branch: true,
                user: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId: existing.branchId,
                action: 'STAFF_UPDATED',
                entityType: 'Staff',
                entityId: updated.id,
                beforeData: existing,
                afterData: updated,
            },
        });
        return updated;
    }
    async remove(id, actor) {
        const existing = await this.prisma.staff.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Staff member not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && existing.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot delete staff from another branch');
        }
        await this.prisma.staff.update({
            where: { id },
            data: { status: 'INACTIVE', deletedAt: new Date() },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId: existing.branchId,
                action: 'STAFF_DEACTIVATED',
                entityType: 'Staff',
                entityId: id,
            },
        });
        return { message: 'Staff member deactivated successfully' };
    }
};
StaffService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], StaffService);
export { StaffService };
//# sourceMappingURL=staff.service.js.map