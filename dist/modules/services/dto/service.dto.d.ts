export declare class CreateVariantDto {
    name: string;
    duration: number;
    price: number;
    currency?: string;
}
export declare class UpdateVariantDto {
    name?: string;
    duration?: number;
    price?: number;
    currency?: string;
    status?: string;
}
export declare class CreateServiceDto {
    code: string;
    name: string;
    categoryId?: string;
    description?: string;
    defaultDuration: number;
    defaultPrice: number;
    currency?: string;
    image?: string;
    notes?: string;
    variants?: CreateVariantDto[];
}
export declare class UpdateServiceDto {
    name?: string;
    categoryId?: string;
    description?: string;
    defaultDuration?: number;
    defaultPrice?: number;
    currency?: string;
    status?: string;
    image?: string;
    notes?: string;
}
export declare class SetBranchPriceDto {
    branchId: string;
    customPrice: number;
    currency: string;
}
export declare class CreateCategoryDto {
    name: string;
    description?: string;
    displayOrder?: number;
}
