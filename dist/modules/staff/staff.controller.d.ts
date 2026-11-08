import { StaffService } from './staff.service.js';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    findAll(user: AuthenticatedUser, branchId?: string, search?: string, status?: string): Promise<any>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreateStaffDto, user: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdateStaffDto, user: AuthenticatedUser): Promise<any>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
