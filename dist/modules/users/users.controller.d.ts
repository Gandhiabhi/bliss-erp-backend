import { UsersService } from './users.service.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(user: AuthenticatedUser, branchId?: string, search?: string): Promise<any>;
    getRoles(): Promise<any>;
    getPermissions(): Promise<any>;
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
    create(dto: CreateUserDto, user: AuthenticatedUser): Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        phone: any;
        branchId: any;
        branch: any;
        roles: any;
    }>;
    update(id: string, dto: UpdateUserDto, user: AuthenticatedUser): Promise<{
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
}
