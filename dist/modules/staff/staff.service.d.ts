import { PrismaService } from '../../database/prisma.service.js';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class StaffService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser, query?: {
        branchId?: string;
        search?: string;
        status?: string;
    }): Promise<any>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreateStaffDto, actor: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdateStaffDto, actor: AuthenticatedUser): Promise<any>;
    remove(id: string, actor: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
