import { PrismaService } from '../../database/prisma.service.js';
import { CreateCustomerDto, UpdateCustomerDto, AddCustomerNoteDto } from './dto/customer.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class CustomersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser, query?: {
        branchId?: string;
        search?: string;
        status?: string;
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
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreateCustomerDto, actor: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdateCustomerDto, actor: AuthenticatedUser): Promise<any>;
    addNote(customerId: string, dto: AddCustomerNoteDto, actor: AuthenticatedUser): Promise<any>;
    remove(id: string, actor: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
