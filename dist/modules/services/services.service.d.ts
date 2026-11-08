import { PrismaService } from '../../database/prisma.service.js';
import { CreateServiceDto, UpdateServiceDto, CreateVariantDto, UpdateVariantDto, SetBranchPriceDto, CreateCategoryDto } from './dto/service.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCategories(): Promise<any>;
    createCategory(dto: CreateCategoryDto): Promise<any>;
    findAll(user: AuthenticatedUser, query?: {
        search?: string;
        categoryId?: string;
        branchId?: string;
    }): Promise<any>;
    findOne(id: string, user: AuthenticatedUser, requestedBranchId?: string): Promise<any>;
    create(dto: CreateServiceDto, actor: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdateServiceDto, actor: AuthenticatedUser): Promise<any>;
    addVariant(serviceId: string, dto: CreateVariantDto, actor: AuthenticatedUser): Promise<any>;
    updateVariant(variantId: string, dto: UpdateVariantDto, actor: AuthenticatedUser): Promise<any>;
    deleteVariant(variantId: string, actor: AuthenticatedUser): Promise<{
        message: string;
    }>;
    setBranchPrice(serviceId: string, dto: SetBranchPriceDto, actor: AuthenticatedUser): Promise<any>;
}
