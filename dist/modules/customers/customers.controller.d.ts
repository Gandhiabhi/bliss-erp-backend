import { CustomersService } from './customers.service.js';
import { CreateCustomerDto, UpdateCustomerDto, AddCustomerNoteDto } from './dto/customer.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(user: AuthenticatedUser, branchId?: string, search?: string, status?: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreateCustomerDto, user: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdateCustomerDto, user: AuthenticatedUser): Promise<any>;
    addNote(id: string, dto: AddCustomerNoteDto, user: AuthenticatedUser): Promise<any>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
