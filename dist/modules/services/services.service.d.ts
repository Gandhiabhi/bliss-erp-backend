import { PrismaService } from '../../database/prisma.service.js';
import { CreateServiceDto, UpdateServiceDto, CreateVariantDto, UpdateVariantDto, SetBranchPriceDto, CreateCategoryDto } from './dto/service.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCategories(): Promise<({
        _count: {
            services: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        displayOrder: number;
    })[]>;
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        displayOrder: number;
    }>;
    findAll(user: AuthenticatedUser, query?: {
        search?: string;
        categoryId?: string;
        branchId?: string;
    }): Promise<{
        effectivePrice: number;
        effectiveCurrency: string;
        branchServices: {
            id: string;
            branchId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            customPrice: import("@prisma/client/runtime/library").Decimal | null;
            serviceId: string;
        }[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            currency: string;
            status: string;
            duration: number;
            price: import("@prisma/client/runtime/library").Decimal;
            serviceId: string;
        }[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            status: string;
            displayOrder: number;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        currency: string;
        status: string;
        deletedAt: Date | null;
        code: string;
        categoryId: string | null;
        defaultDuration: number;
        defaultPrice: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        notes: string | null;
    }[]>;
    findOne(id: string, user: AuthenticatedUser, requestedBranchId?: string): Promise<{
        effectivePrice: number;
        effectiveCurrency: string;
        branchServices: (({
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
            };
        } & {
            id: string;
            branchId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            customPrice: import("@prisma/client/runtime/library").Decimal | null;
            serviceId: string;
        }) | ({
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
            };
        } & {
            id: string;
            branchId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            customPrice: import("@prisma/client/runtime/library").Decimal | null;
            serviceId: string;
        }))[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            currency: string;
            status: string;
            duration: number;
            price: import("@prisma/client/runtime/library").Decimal;
            serviceId: string;
        }[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            status: string;
            displayOrder: number;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        currency: string;
        status: string;
        deletedAt: Date | null;
        code: string;
        categoryId: string | null;
        defaultDuration: number;
        defaultPrice: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        notes: string | null;
    }>;
    create(dto: CreateServiceDto, actor: AuthenticatedUser): Promise<{
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            currency: string;
            status: string;
            duration: number;
            price: import("@prisma/client/runtime/library").Decimal;
            serviceId: string;
        }[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            status: string;
            displayOrder: number;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        currency: string;
        status: string;
        deletedAt: Date | null;
        code: string;
        categoryId: string | null;
        defaultDuration: number;
        defaultPrice: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        notes: string | null;
    }>;
    update(id: string, dto: UpdateServiceDto, actor: AuthenticatedUser): Promise<{
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            currency: string;
            status: string;
            duration: number;
            price: import("@prisma/client/runtime/library").Decimal;
            serviceId: string;
        }[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            status: string;
            displayOrder: number;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        currency: string;
        status: string;
        deletedAt: Date | null;
        code: string;
        categoryId: string | null;
        defaultDuration: number;
        defaultPrice: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        notes: string | null;
    }>;
    addVariant(serviceId: string, dto: CreateVariantDto, actor: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        currency: string;
        status: string;
        duration: number;
        price: import("@prisma/client/runtime/library").Decimal;
        serviceId: string;
    }>;
    updateVariant(variantId: string, dto: UpdateVariantDto, actor: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        currency: string;
        status: string;
        duration: number;
        price: import("@prisma/client/runtime/library").Decimal;
        serviceId: string;
    }>;
    deleteVariant(variantId: string, actor: AuthenticatedUser): Promise<{
        message: string;
    }>;
    setBranchPrice(serviceId: string, dto: SetBranchPriceDto, actor: AuthenticatedUser): Promise<{
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
        };
        service: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            currency: string;
            status: string;
            deletedAt: Date | null;
            code: string;
            categoryId: string | null;
            defaultDuration: number;
            defaultPrice: import("@prisma/client/runtime/library").Decimal;
            image: string | null;
            notes: string | null;
        };
    } & {
        id: string;
        branchId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        customPrice: import("@prisma/client/runtime/library").Decimal | null;
        serviceId: string;
    }>;
}
