export declare class PlanServiceItemDto {
    serviceId: string;
    serviceVariantId?: string;
    quantity: number;
}
export declare class CreatePlanDto {
    code: string;
    name: string;
    branchId?: string;
    description?: string;
    durationDays: number;
    price: number;
    currency?: string;
    services: PlanServiceItemDto[];
}
export declare class UpdatePlanDto {
    name?: string;
    description?: string;
    durationDays?: number;
    price?: number;
    currency?: string;
    status?: string;
    services?: PlanServiceItemDto[];
}
