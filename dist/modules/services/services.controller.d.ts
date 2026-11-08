import { ServicesService } from './services.service.js';
import { CreateServiceDto, UpdateServiceDto, CreateVariantDto, UpdateVariantDto, SetBranchPriceDto, CreateCategoryDto } from './dto/service.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    getCategories(): Promise<any>;
    createCategory(dto: CreateCategoryDto): Promise<any>;
    findAll(user: AuthenticatedUser, search?: string, categoryId?: string, branchId?: string): Promise<any>;
    findOne(id: string, user: AuthenticatedUser, branchId?: string): Promise<any>;
    create(dto: CreateServiceDto, user: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdateServiceDto, user: AuthenticatedUser): Promise<any>;
    addVariant(id: string, dto: CreateVariantDto, user: AuthenticatedUser): Promise<any>;
    updateVariant(variantId: string, dto: UpdateVariantDto, user: AuthenticatedUser): Promise<any>;
    deleteVariant(variantId: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
    setBranchPrice(id: string, dto: SetBranchPriceDto, user: AuthenticatedUser): Promise<any>;
}
