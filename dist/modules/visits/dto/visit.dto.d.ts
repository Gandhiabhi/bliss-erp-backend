import { VisitStatus } from '@prisma/client';
export declare class RedeemServiceItemDto {
    serviceId: string;
    serviceVariantId?: string;
    membershipServiceId?: string;
    staffId?: string;
    quantity: number;
    notes?: string;
}
export declare class CreateVisitDto {
    customerId: string;
    branchId?: string;
    membershipId?: string;
    visitDate?: string;
    checkInTime?: string;
    notes?: string;
    services: RedeemServiceItemDto[];
}
export declare class UpdateVisitStatusDto {
    status: VisitStatus;
    notes?: string;
}
