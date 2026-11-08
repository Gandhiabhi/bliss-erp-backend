import { PrismaService } from '../../database/prisma.service.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser, query?: {
        branchId?: string;
        search?: string;
    }): Promise<any>;
    findOne(id: string, user: AuthenticatedUser): Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        phone: any;
        branchId: any;
        branch: any;
        isActive: any;
        lastLoginAt: any;
        createdAt: any;
        roles: any;
    }>;
    create(dto: CreateUserDto, actor: AuthenticatedUser): Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        phone: any;
        branchId: any;
        branch: any;
        roles: any;
    }>;
    update(id: string, dto: UpdateUserDto, actor: AuthenticatedUser): Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        phone: any;
        branchId: any;
        branch: any;
        isActive: any;
        roles: any;
    }>;
    getRoles(): Promise<any>;
    getPermissions(): Promise<any>;
}
