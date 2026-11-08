import { PrismaService } from '../../database/prisma.service.js';
import { CreatePaymentDto, RefundPaymentDto, CreateInvoiceDto } from './dto/payment.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class PaymentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllPayments(user: AuthenticatedUser, query?: {
        branchId?: string;
        customerId?: string;
        status?: string;
        method?: string;
        date?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOnePayment(id: string, user: AuthenticatedUser): Promise<any>;
    createPayment(dto: CreatePaymentDto, actor: AuthenticatedUser): Promise<any>;
    refundPayment(id: string, dto: RefundPaymentDto, actor: AuthenticatedUser): Promise<any>;
    findAllInvoices(user: AuthenticatedUser, query?: {
        branchId?: string;
        customerId?: string;
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOneInvoice(id: string, user: AuthenticatedUser): Promise<any>;
    createInvoice(dto: CreateInvoiceDto, actor: AuthenticatedUser): Promise<any>;
}
