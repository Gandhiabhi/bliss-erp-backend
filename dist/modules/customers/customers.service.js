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
let CustomersService = class CustomersService {
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
                { displayName: { contains: query.search, mode: 'insensitive' } },
                { firstName: { contains: query.search, mode: 'insensitive' } },
                { lastName: { contains: query.search, mode: 'insensitive' } },
                { customerCode: { contains: query.search, mode: 'insensitive' } },
                { phone: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const page = Math.max(1, Number(query?.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(query?.limit) || 20));
        const skip = (page - 1) * limit;
        const [total, customers] = await Promise.all([
            this.prisma.customer.count({ where }),
            this.prisma.customer.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    branch: { select: { id: true, name: true, branchCode: true, currency: true, timezone: true } },
                    memberships: {
                        where: { status: 'ACTIVE' },
                        include: {
                            services: {
                                include: {
                                    service: true,
                                    serviceVariant: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            memberships: true,
                            visits: true,
                            appointments: true,
                            invoices: true,
                        },
                    },
                },
            }),
        ]);
        const enhanced = customers.map((c) => {
            let totalAllocatedServices = 0;
            let totalConsumedServices = 0;
            for (const m of c.memberships) {
                for (const s of m.services) {
                    totalAllocatedServices += s.allocatedQuantity;
                    totalConsumedServices += s.consumedQuantity;
                }
            }
            const activeMembership = c.memberships[0] || null;
            return {
                ...c,
                activeMembership,
                totalServicesRemaining: totalAllocatedServices - totalConsumedServices,
                totalAllocatedServices,
                totalConsumedServices,
            };
        });
        return {
            data: enhanced,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, user) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
            include: {
                branch: true,
                memberships: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        planTemplate: true,
                        services: {
                            include: {
                                service: true,
                                serviceVariant: true,
                            },
                        },
                        payments: {
                            orderBy: { paymentDate: 'desc' },
                        },
                    },
                },
                visits: {
                    orderBy: { visitDate: 'desc' },
                    include: {
                        visitServices: {
                            include: {
                                service: true,
                                serviceVariant: true,
                                staff: true,
                            },
                        },
                    },
                },
                appointments: {
                    orderBy: { scheduledDate: 'desc' },
                    include: {
                        service: true,
                        serviceVariant: true,
                        staff: true,
                    },
                },
                invoices: {
                    orderBy: { issueDate: 'desc' },
                    include: {
                        items: true,
                        payments: true,
                    },
                },
                payments: {
                    orderBy: { paymentDate: 'desc' },
                },
                customerNotes: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!customer || customer.deletedAt) {
            throw new NotFoundException('Customer profile not found');
        }
        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && customer.branchId !== user.branchId) {
            throw new ForbiddenException('Access denied to customer in another branch');
        }
        const activeMemberships = customer.memberships.filter((m) => m.status === 'ACTIVE');
        const serviceEntitlements = [];
        const now = new Date();
        for (const mem of activeMemberships) {
            const isExpired = new Date(mem.endDate) < now;
            for (const ms of mem.services) {
                const remaining = Math.max(0, ms.allocatedQuantity - ms.consumedQuantity);
                const percentageUsed = ms.allocatedQuantity > 0
                    ? Math.round((ms.consumedQuantity / ms.allocatedQuantity) * 100)
                    : 0;
                serviceEntitlements.push({
                    membershipId: mem.id,
                    membershipName: mem.name,
                    membershipServiceId: ms.id,
                    serviceId: ms.service.id,
                    serviceName: ms.service.name,
                    variantName: ms.serviceVariant?.name || null,
                    allocated: ms.allocatedQuantity,
                    used: ms.consumedQuantity,
                    remaining,
                    percentageUsed,
                    isExpired,
                    expiresAt: mem.endDate,
                });
            }
        }
        return {
            ...customer,
            serviceEntitlements,
        };
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
        const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
        const codePrefix = branch?.branchCode ? branch.branchCode.replace(/[^a-zA-Z0-9]/g, '') : 'BR';
        const count = await this.prisma.customer.count({ where: { branchId } });
        const customerCode = `CUST-${codePrefix}-${String(count + 1).padStart(4, '0')}`;
        const displayName = dto.displayName ||
            (dto.lastName ? `${dto.firstName} ${dto.lastName}` : dto.firstName);
        const customer = await this.prisma.customer.create({
            data: {
                customerCode,
                branchId,
                firstName: dto.firstName,
                lastName: dto.lastName || null,
                displayName,
                phone: dto.phone,
                email: dto.email || null,
                gender: dto.gender || null,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
                nationality: dto.nationality || null,
                address: dto.address || null,
                city: dto.city || null,
                country: dto.country || null,
                emergencyContact: dto.emergencyContact || null,
                profileImage: dto.profileImage || null,
                notes: dto.notes || null,
                preferredLanguage: dto.preferredLanguage || null,
                status: 'ACTIVE',
            },
            include: {
                branch: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId,
                action: 'CUSTOMER_CREATED',
                entityType: 'Customer',
                entityId: customer.id,
                afterData: customer,
            },
        });
        return customer;
    }
    async update(id, dto, actor) {
        const existing = await this.prisma.customer.findUnique({ where: { id } });
        if (!existing || existing.deletedAt) {
            throw new NotFoundException('Customer profile not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && existing.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot edit customer from another branch');
        }
        const updated = await this.prisma.customer.update({
            where: { id },
            data: {
                firstName: dto.firstName !== undefined ? dto.firstName : undefined,
                lastName: dto.lastName !== undefined ? dto.lastName : undefined,
                displayName: dto.displayName !== undefined ? dto.displayName : undefined,
                phone: dto.phone !== undefined ? dto.phone : undefined,
                email: dto.email !== undefined ? dto.email : undefined,
                gender: dto.gender !== undefined ? dto.gender : undefined,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
                nationality: dto.nationality !== undefined ? dto.nationality : undefined,
                address: dto.address !== undefined ? dto.address : undefined,
                city: dto.city !== undefined ? dto.city : undefined,
                country: dto.country !== undefined ? dto.country : undefined,
                emergencyContact: dto.emergencyContact !== undefined ? dto.emergencyContact : undefined,
                profileImage: dto.profileImage !== undefined ? dto.profileImage : undefined,
                notes: dto.notes !== undefined ? dto.notes : undefined,
                preferredLanguage: dto.preferredLanguage !== undefined ? dto.preferredLanguage : undefined,
                status: dto.status !== undefined ? dto.status : undefined,
            },
            include: {
                branch: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId: existing.branchId,
                action: 'CUSTOMER_UPDATED',
                entityType: 'Customer',
                entityId: updated.id,
                beforeData: existing,
                afterData: updated,
            },
        });
        return updated;
    }
    async addNote(customerId, dto, actor) {
        const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer || customer.deletedAt) {
            throw new NotFoundException('Customer profile not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && customer.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot add note to customer in another branch');
        }
        return this.prisma.customerNote.create({
            data: {
                customerId,
                branchId: customer.branchId,
                authorId: actor.id,
                authorName: `${actor.firstName} ${actor.lastName}`,
                note: dto.note,
            },
        });
    }
    async remove(id, actor) {
        const existing = await this.prisma.customer.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Customer profile not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && existing.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot deactivate customer from another branch');
        }
        await this.prisma.customer.update({
            where: { id },
            data: { status: 'INACTIVE', deletedAt: new Date() },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId: existing.branchId,
                action: 'CUSTOMER_DEACTIVATED',
                entityType: 'Customer',
                entityId: id,
            },
        });
        return { message: 'Customer profile deactivated successfully' };
    }
};
CustomersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CustomersService);
export { CustomersService };
//# sourceMappingURL=customers.service.js.map