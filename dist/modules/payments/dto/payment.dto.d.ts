import { PaymentMethod } from '@prisma/client';
export declare class CreatePaymentDto {
    customerId: string;
    branchId?: string;
    invoiceId?: string;
    membershipId?: string;
    amount: number;
    currency?: string;
    paymentMethod: PaymentMethod;
    transactionReference?: string;
    paymentDate?: string;
    notes?: string;
}
export declare class RefundPaymentDto {
    amount: number;
    reason: string;
}
export declare class CreateInvoiceItemDto {
    description: string;
    serviceId?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
    currency?: string;
}
export declare class CreateInvoiceDto {
    customerId: string;
    branchId?: string;
    membershipId?: string;
    visitId?: string;
    issueDate?: string;
    dueDate?: string;
    currency?: string;
    notes?: string;
    items: CreateInvoiceItemDto[];
}
