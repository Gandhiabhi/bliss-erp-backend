var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException, } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { resolveBranchId } from '../../common/utils/branch-filter.js';
import { uniqueCode } from '../../common/utils/record-codes.js';
import { VisitStatus } from '@prisma/client';
let VisitsService = class VisitsService {
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
        if (query?.status) {
            where.status = query.status;
        }
        if (query?.date) {
            const targetDate = new Date(query.date);
            const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
            where.visitDate = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
        if (query?.search) {
            where.OR = [
                { visitCode: { contains: query.search, mode: 'insensitive' } },
                { customer: { displayName: { contains: query.search, mode: 'insensitive' } } },
                { customer: { phone: { contains: query.search, mode: 'insensitive' } } },
            ];
        }
        const page = Math.max(1, Number(query?.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(query?.limit) || 20));
        const skip = (page - 1) * limit;
        const [total, visits] = await Promise.all([
            this.prisma.visit.count({ where }),
            this.prisma.visit.findMany({
                where,
                skip,
                take: limit,
                orderBy: { visitDate: 'desc' },
                include: {
                    customer: { select: { id: true, displayName: true, phone: true, customerCode: true } },
                    branch: { select: { id: true, name: true, branchCode: true, currency: true, timezone: true } },
                    membership: { select: { id: true, membershipCode: true, name: true } },
                    createdBy: { select: { id: true, firstName: true, lastName: true } },
                    visitServices: {
                        include: {
                            service: { select: { id: true, name: true, code: true } },
                            serviceVariant: { select: { id: true, name: true, duration: true } },
                            staff: { select: { id: true, name: true, position: true } },
                        },
                    },
                },
            }),
        ]);
        return {
            data: visits,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, user) {
        const visit = await this.prisma.visit.findUnique({
            where: { id },
            include: {
                customer: true,
                branch: true,
                membership: {
                    include: {
                        services: {
                            include: { service: true, serviceVariant: true },
                        },
                    },
                },
                createdBy: true,
                visitServices: {
                    include: {
                        service: true,
                        serviceVariant: true,
                        staff: true,
                        membershipService: true,
                    },
                },
            },
        });
        if (!visit) {
            throw new NotFoundException('Visit record not found');
        }
        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && visit.branchId !== user.branchId) {
            throw new ForbiddenException('Access denied to visit from another branch');
        }
        return visit;
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
            throw new ForbiddenException('Cannot create visit for customer from another branch');
        }
        const branchId = customer.branchId;
        const branch = customer.branch;
        if (!dto.services || dto.services.length === 0) {
            throw new BadRequestException('At least one service must be specified for visit check-in');
        }
        for (const item of dto.services) {
            if (!item.staffId)
                continue;
            const therapist = await this.prisma.staff.findUnique({ where: { id: item.staffId } });
            if (!therapist || therapist.deletedAt || therapist.status !== 'ACTIVE') {
                throw new NotFoundException('Therapist not found');
            }
            if (therapist.branchId !== branchId) {
                throw new BadRequestException('This therapist works at another branch.');
            }
        }
        const visitCode = uniqueCode('VST', branch.branchCode);
        const result = await this.prisma.$transaction(async (tx) => {
            const visit = await tx.visit.create({
                data: {
                    visitCode,
                    branchId,
                    customerId: customer.id,
                    membershipId: dto.membershipId || null,
                    visitDate: dto.visitDate ? new Date(dto.visitDate) : new Date(),
                    checkInTime: dto.checkInTime ? new Date(dto.checkInTime) : new Date(),
                    status: VisitStatus.CHECKED_IN,
                    notes: dto.notes,
                    createdById: actor.id,
                },
            });
            const createdVisitServices = [];
            for (const item of dto.services) {
                const service = await tx.service.findUnique({
                    where: { id: item.serviceId },
                });
                if (!service) {
                    throw new NotFoundException(`Service ${item.serviceId} not found`);
                }
                let variant = null;
                if (item.serviceVariantId) {
                    variant = await tx.serviceVariant.findUnique({
                        where: { id: item.serviceVariantId },
                    });
                }
                const unitPriceSnapshot = variant ? Number(variant.price) : Number(service.defaultPrice);
                const currencySnapshot = variant?.currency || service.currency || branch.currency;
                const serviceNameSnapshot = service.name;
                const variantNameSnapshot = variant?.name || null;
                let membershipServiceId = item.membershipServiceId;
                if (dto.membershipId && !membershipServiceId) {
                    const match = await tx.membershipService.findFirst({
                        where: {
                            membershipId: dto.membershipId,
                            serviceId: service.id,
                        },
                    });
                    if (match) {
                        membershipServiceId = match.id;
                    }
                }
                if (membershipServiceId) {
                    const memService = await tx.membershipService.findUnique({
                        where: { id: membershipServiceId },
                        include: { membership: true },
                    });
                    if (!memService) {
                        throw new NotFoundException('Specified membership entitlement was not found');
                    }
                    if (memService.membership.status !== 'ACTIVE') {
                        throw new ConflictException(`Membership ${memService.membership.membershipCode} is not active (Status: ${memService.membership.status})`);
                    }
                    if (new Date(memService.membership.endDate) < new Date()) {
                        throw new ConflictException('Membership has expired');
                    }
                    const remaining = memService.allocatedQuantity - memService.consumedQuantity;
                    if (remaining < item.quantity) {
                        throw new ConflictException(`Insufficient service entitlement for "${serviceNameSnapshot}". Available: ${remaining}, Requested: ${item.quantity}`);
                    }
                    await tx.membershipService.update({
                        where: { id: membershipServiceId },
                        data: {
                            consumedQuantity: { increment: item.quantity },
                        },
                    });
                }
                const vs = await tx.visitService.create({
                    data: {
                        visitId: visit.id,
                        membershipServiceId: membershipServiceId || null,
                        serviceId: service.id,
                        serviceVariantId: item.serviceVariantId || null,
                        staffId: item.staffId || null,
                        quantity: item.quantity,
                        serviceNameSnapshot,
                        variantNameSnapshot,
                        unitPriceSnapshot,
                        currencySnapshot,
                        status: 'COMPLETED',
                        notes: item.notes,
                    },
                    include: {
                        service: true,
                        serviceVariant: true,
                        staff: true,
                    },
                });
                createdVisitServices.push(vs);
            }
            await tx.auditLog.create({
                data: {
                    actorId: actor.id,
                    actorName: `${actor.firstName} ${actor.lastName}`,
                    branchId,
                    action: 'SERVICE_CONSUMED',
                    entityType: 'Visit',
                    entityId: visit.id,
                    afterData: {
                        visitCode: visit.visitCode,
                        customer: customer.displayName,
                        membershipId: dto.membershipId,
                        consumedServices: createdVisitServices.map((cs) => ({
                            service: cs.serviceNameSnapshot,
                            variant: cs.variantNameSnapshot,
                            quantity: cs.quantity,
                            therapist: cs.staff?.name,
                        })),
                    },
                },
            });
            return {
                ...visit,
                visitServices: createdVisitServices,
            };
        });
        return result;
    }
    async updateStatus(id, dto, actor) {
        const existing = await this.prisma.visit.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Visit not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && existing.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot edit visit in another branch');
        }
        const updateData = {
            status: dto.status,
        };
        if (dto.status === VisitStatus.COMPLETED && !existing.checkOutTime) {
            updateData.checkOutTime = new Date();
        }
        if (dto.notes) {
            updateData.notes = `${existing.notes || ''}\n[${new Date().toISOString()}] ${dto.notes}`;
        }
        const updated = await this.prisma.visit.update({
            where: { id },
            data: updateData,
            include: {
                visitServices: {
                    include: { service: true, serviceVariant: true, staff: true },
                },
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId: existing.branchId,
                action: 'VISIT_STATUS_UPDATED',
                entityType: 'Visit',
                entityId: id,
                beforeData: { status: existing.status },
                afterData: { status: dto.status },
            },
        });
        return updated;
    }
};
VisitsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], VisitsService);
export { VisitsService };
//# sourceMappingURL=visits.service.js.map