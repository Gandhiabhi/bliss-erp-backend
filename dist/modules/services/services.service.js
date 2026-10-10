var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException, ForbiddenException, } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategories() {
        return this.prisma.serviceCategory.findMany({
            orderBy: { displayOrder: 'asc' },
            include: {
                _count: { select: { services: true } },
            },
        });
    }
    async createCategory(dto) {
        const existing = await this.prisma.serviceCategory.findUnique({
            where: { name: dto.name },
        });
        if (existing) {
            throw new ConflictException(`Category '${dto.name}' already exists`);
        }
        return this.prisma.serviceCategory.create({
            data: {
                name: dto.name,
                description: dto.description,
                displayOrder: dto.displayOrder || 0,
            },
        });
    }
    async findAll(user, query) {
        const targetBranchId = user.roles.includes('SUPER_ADMIN')
            ? query?.branchId
            : user.branchId;
        const where = {
            deletedAt: null,
        };
        if (query?.categoryId) {
            where.categoryId = query.categoryId;
        }
        if (query?.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { code: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const services = await this.prisma.service.findMany({
            where,
            orderBy: { name: 'asc' },
            include: {
                category: true,
                variants: {
                    where: { status: 'ACTIVE' },
                    orderBy: { duration: 'asc' },
                },
                branchServices: targetBranchId
                    ? {
                        where: { branchId: targetBranchId, isActive: true },
                    }
                    : false,
            },
        });
        return services.map((s) => {
            let activePrice = Number(s.defaultPrice);
            let activeCurrency = s.currency;
            if (targetBranchId && s.branchServices && s.branchServices.length > 0) {
                const branchPricing = s.branchServices[0];
                if (branchPricing.customPrice !== null) {
                    activePrice = Number(branchPricing.customPrice);
                }
                activeCurrency = branchPricing.currency;
            }
            return {
                ...s,
                effectivePrice: activePrice,
                effectiveCurrency: activeCurrency,
            };
        });
    }
    async findOne(id, user, requestedBranchId) {
        const targetBranchId = user.roles.includes('SUPER_ADMIN')
            ? requestedBranchId
            : user.branchId;
        const service = await this.prisma.service.findUnique({
            where: { id },
            include: {
                category: true,
                variants: {
                    orderBy: { duration: 'asc' },
                },
                branchServices: targetBranchId
                    ? {
                        where: { branchId: targetBranchId },
                        include: { branch: true },
                    }
                    : {
                        include: { branch: true },
                    },
            },
        });
        if (!service || service.deletedAt) {
            throw new NotFoundException('Service not found');
        }
        let effectivePrice = Number(service.defaultPrice);
        let effectiveCurrency = service.currency;
        if (targetBranchId && service.branchServices && service.branchServices.length > 0) {
            const match = service.branchServices.find((bs) => bs.branchId === targetBranchId);
            if (match && match.customPrice !== null) {
                effectivePrice = Number(match.customPrice);
                effectiveCurrency = match.currency;
            }
        }
        return {
            ...service,
            effectivePrice,
            effectiveCurrency,
        };
    }
    async create(dto, actor) {
        const existing = await this.prisma.service.findUnique({
            where: { code: dto.code.toUpperCase().trim() },
        });
        if (existing) {
            throw new ConflictException(`Service code '${dto.code}' already exists`);
        }
        const service = await this.prisma.service.create({
            data: {
                code: dto.code.toUpperCase().trim(),
                name: dto.name,
                categoryId: dto.categoryId || null,
                description: dto.description,
                defaultDuration: dto.defaultDuration,
                defaultPrice: dto.defaultPrice,
                currency: (dto.currency || 'AED').toUpperCase(),
                image: dto.image,
                notes: dto.notes,
                variants: dto.variants && dto.variants.length > 0
                    ? {
                        create: dto.variants.map((v) => ({
                            name: v.name,
                            duration: v.duration,
                            price: v.price,
                            currency: (v.currency || dto.currency || 'AED').toUpperCase(),
                            status: 'ACTIVE',
                        })),
                    }
                    : undefined,
            },
            include: {
                variants: true,
                category: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                action: 'SERVICE_CREATED',
                entityType: 'Service',
                entityId: service.id,
                afterData: service,
            },
        });
        return service;
    }
    async update(id, dto, actor) {
        const existing = await this.prisma.service.findUnique({ where: { id } });
        if (!existing || existing.deletedAt) {
            throw new NotFoundException('Service not found');
        }
        const updated = await this.prisma.service.update({
            where: { id },
            data: {
                ...dto,
                currency: dto.currency ? dto.currency.toUpperCase() : undefined,
            },
            include: {
                category: true,
                variants: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                action: 'SERVICE_UPDATED',
                entityType: 'Service',
                entityId: updated.id,
                beforeData: existing,
                afterData: updated,
            },
        });
        return updated;
    }
    async addVariant(serviceId, dto, actor) {
        const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
        if (!service || service.deletedAt) {
            throw new NotFoundException('Service not found');
        }
        const variant = await this.prisma.serviceVariant.create({
            data: {
                serviceId,
                name: dto.name,
                duration: dto.duration,
                price: dto.price,
                currency: (dto.currency || service.currency).toUpperCase(),
                status: 'ACTIVE',
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                action: 'SERVICE_VARIANT_CREATED',
                entityType: 'ServiceVariant',
                entityId: variant.id,
                afterData: variant,
            },
        });
        return variant;
    }
    async updateVariant(variantId, dto, actor) {
        const existing = await this.prisma.serviceVariant.findUnique({ where: { id: variantId } });
        if (!existing) {
            throw new NotFoundException('Variant not found');
        }
        const updated = await this.prisma.serviceVariant.update({
            where: { id: variantId },
            data: {
                ...dto,
                currency: dto.currency ? dto.currency.toUpperCase() : undefined,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                action: 'SERVICE_VARIANT_UPDATED',
                entityType: 'ServiceVariant',
                entityId: updated.id,
                beforeData: existing,
                afterData: updated,
            },
        });
        return updated;
    }
    async deleteVariant(variantId, actor) {
        const existing = await this.prisma.serviceVariant.findUnique({ where: { id: variantId } });
        if (!existing) {
            throw new NotFoundException('Variant not found');
        }
        await this.prisma.serviceVariant.update({
            where: { id: variantId },
            data: { status: 'INACTIVE' },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                action: 'SERVICE_VARIANT_DEACTIVATED',
                entityType: 'ServiceVariant',
                entityId: variantId,
            },
        });
        return { message: 'Variant deactivated successfully' };
    }
    async setBranchPrice(serviceId, dto, actor) {
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && actor.branchId !== dto.branchId) {
            throw new ForbiddenException('Cannot modify pricing for another branch');
        }
        const branchService = await this.prisma.branchService.upsert({
            where: {
                branchId_serviceId: {
                    branchId: dto.branchId,
                    serviceId,
                },
            },
            update: {
                customPrice: dto.customPrice,
                currency: dto.currency.toUpperCase(),
                isActive: true,
            },
            create: {
                branchId: dto.branchId,
                serviceId,
                customPrice: dto.customPrice,
                currency: dto.currency.toUpperCase(),
                isActive: true,
            },
            include: {
                branch: true,
                service: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId: dto.branchId,
                action: 'BRANCH_SERVICE_PRICE_UPDATED',
                entityType: 'BranchService',
                entityId: branchService.id,
                afterData: { serviceId, branchId: dto.branchId, customPrice: dto.customPrice, currency: dto.currency },
            },
        });
        return branchService;
    }
};
ServicesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ServicesService);
export { ServicesService };
//# sourceMappingURL=services.service.js.map