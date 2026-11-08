import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto, RefundPaymentDto, CreateInvoiceDto } from './dto/payment.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAllPayments(user: AuthenticatedUser, branchId?: string, customerId?: string, status?: string, method?: string, date?: string, search?: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOnePayment(id: string, user: AuthenticatedUser): Promise<any>;
    createPayment(dto: CreatePaymentDto, user: AuthenticatedUser): Promise<any>;
    refundPayment(id: string, dto: RefundPaymentDto, user: AuthenticatedUser): Promise<any>;
    findAllInvoices(user: AuthenticatedUser, branchId?: string, customerId?: string, status?: string, search?: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOneInvoice(id: string, user: AuthenticatedUser): Promise<any>;
    createInvoice(dto: CreateInvoiceDto, user: AuthenticatedUser): Promise<any>;
}
