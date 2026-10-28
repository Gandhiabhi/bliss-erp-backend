import { PrismaService } from '../../database/prisma.service.js';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class PlansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser, query?: {
        branchId?: string;
        search?: string;
        status?: string;
    }): Promise<({
        branch: {
            id: string;
            name: string;
            branchCode: string;
            currency: string;
        } | null;
        _count: {
            memberships: number;
        };
        services: ({
            service: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                currency: string;
                status: string;
                deletedAt: Date | null;
                notes: string | null;
                code: string;
                categoryId: string | null;
                defaultDuration: number;
                defaultPrice: import("@prisma/client/runtime/library").Decimal;
                image: string | null;
            };
            serviceVariant: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                currency: string;
                status: string;
                duration: number;
                price: import("@prisma/client/runtime/library").Decimal;
                serviceId: string;
            } | null;
        } & {
            id: string;
            serviceId: string;
            quantity: number;
            planTemplateId: string;
            serviceVariantId: string | null;
        })[];
    } & {
        id: string;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        currency: string;
        status: string;
        deletedAt: Date | null;
        price: import("@prisma/client/runtime/library").Decimal;
        code: string;
        createdById: string | null;
        durationDays: number;
    })[]>;
    findOne(id: string, user: AuthenticatedUser): Promise<{
        branch: {
            email: string | null;
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchCode: string;
            country: string;
            state: string | null;
            city: string;
            address: string | null;
            timezone: string;
            currency: string;
            logo: string | null;
            openingTime: string | null;
            closingTime: string | null;
            status: import(".prisma/client").$Enums.BranchStatus;
            deletedAt: Date | null;
        } | null;
        _count: {
            memberships: number;
        };
        services: ({
            service: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                currency: string;
                status: string;
                deletedAt: Date | null;
                notes: string | null;
                code: string;
                categoryId: string | null;
                defaultDuration: number;
                defaultPrice: import("@prisma/client/runtime/library").Decimal;
                image: string | null;
            };
            serviceVariant: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                currency: string;
                status: string;
                duration: number;
                price: import("@prisma/client/runtime/library").Decimal;
                serviceId: string;
            } | null;
        } & {
            id: string;
            serviceId: string;
            quantity: number;
            planTemplateId: string;
            serviceVariantId: string | null;
        })[];
    } & {
        id: string;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        currency: string;
        status: string;
        deletedAt: Date | null;
        price: import("@prisma/client/runtime/library").Decimal;
        code: string;
        createdById: string | null;
        durationDays: number;
    }>;
    create(dto: CreatePlanDto, actor: AuthenticatedUser): Promise<{
        branch: {
            email: string | null;
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchCode: string;
            country: string;
            state: string | null;
            city: string;
            address: string | null;
            timezone: string;
            currency: string;
            logo: string | null;
            openingTime: string | null;
            closingTime: string | null;
            status: import(".prisma/client").$Enums.BranchStatus;
            deletedAt: Date | null;
        } | null;
        services: ({
            service: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                currency: string;
                status: string;
                deletedAt: Date | null;
                notes: string | null;
                code: string;
                categoryId: string | null;
                defaultDuration: number;
                defaultPrice: import("@prisma/client/runtime/library").Decimal;
                image: string | null;
            };
            serviceVariant: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                currency: string;
                status: string;
                duration: number;
                price: import("@prisma/client/runtime/library").Decimal;
                serviceId: string;
            } | null;
        } & {
            id: string;
            serviceId: string;
            quantity: number;
            planTemplateId: string;
            serviceVariantId: string | null;
        })[];
    } & {
        id: string;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        currency: string;
        status: string;
        deletedAt: Date | null;
        price: import("@prisma/client/runtime/library").Decimal;
        code: string;
        createdById: string | null;
        durationDays: number;
    }>;
    update(id: string, dto: UpdatePlanDto, actor: AuthenticatedUser): Promise<{
        branch: {
            email: string | null;
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchCode: string;
            country: string;
            state: string | null;
            city: string;
            address: string | null;
            timezone: string;
            currency: string;
            logo: string | null;
            openingTime: string | null;
            closingTime: string | null;
            status: import(".prisma/client").$Enums.BranchStatus;
            deletedAt: Date | null;
        } | null;
        services: ({
            service: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                currency: string;
                status: string;
                deletedAt: Date | null;
                notes: string | null;
                code: string;
                categoryId: string | null;
                defaultDuration: number;
                defaultPrice: import("@prisma/client/runtime/library").Decimal;
                image: string | null;
            };
            serviceVariant: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                currency: string;
                status: string;
                duration: number;
                price: import("@prisma/client/runtime/library").Decimal;
                serviceId: string;
            } | null;
        } & {
            id: string;
            serviceId: string;
            quantity: number;
            planTemplateId: string;
            serviceVariantId: string | null;
        })[];
    } & {
        id: string;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        currency: string;
        status: string;
        deletedAt: Date | null;
        price: import("@prisma/client/runtime/library").Decimal;
        code: string;
        createdById: string | null;
        durationDays: number;
    }>;
    remove(id: string, actor: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
