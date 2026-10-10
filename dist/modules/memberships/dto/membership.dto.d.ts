import { MembershipStatus, PaymentMethod } from '@prisma/client';
export declare class MembershipServiceAllocationDto {
    serviceId: string;
    serviceVariantId?: string;
    allocatedQuantity: number;
    notes?: string;
}
export declare class CreateMembershipDto {
    customerId: string;
    branchId?: string;
    planTemplateId?: string;
    isCustomPlan?: boolean;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    price: number;
    currency?: string;
    discount?: number;
    tax?: number;
    notes?: string;
    services?: MembershipServiceAllocationDto[];
    recordPayment?: boolean;
    paymentMethod?: PaymentMethod;
    transactionReference?: string;
}
export declare class UpdateMembershipStatusDto {
    status: MembershipStatus;
    notes?: string;
}
