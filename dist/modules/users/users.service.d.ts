import { PrismaService } from '../../database/prisma.service.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser, query?: {
        branchId?: string;
        search?: string;
    }): Promise<{
        roles: string[];
        branch: {
            id: string;
            name: string;
            branchCode: string;
            country: string;
            city: string;
        } | null;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        branchId: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        userRoles: {
            role: {
                id: string;
                name: string;
                description: string | null;
            };
        }[];
    }[]>;
    findOne(id: string, user: AuthenticatedUser): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        branchId: string | null;
        branch: {
            email: string | null;
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchCode: string;
            country: string;
            state: string | null;
            city: string;
            address: string | null;
            timezone: string;
            currency: string;
            logo: string | null;
            openingTime: string | null;
            closingTime: string | null;
            status: import(".prisma/client").$Enums.BranchStatus;
            deletedAt: Date | null;
        } | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        roles: string[];
    }>;
    create(dto: CreateUserDto, actor: AuthenticatedUser): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        branchId: string | null;
        branch: {
            email: string | null;
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchCode: string;
            country: string;
            state: string | null;
            city: string;
            address: string | null;
            timezone: string;
            currency: string;
            logo: string | null;
            openingTime: string | null;
            closingTime: string | null;
            status: import(".prisma/client").$Enums.BranchStatus;
            deletedAt: Date | null;
        } | null;
        roles: string[];
    }>;
    update(id: string, dto: UpdateUserDto, actor: AuthenticatedUser): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        branchId: string | null;
        branch: {
            email: string | null;
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchCode: string;
            country: string;
            state: string | null;
            city: string;
            address: string | null;
            timezone: string;
            currency: string;
            logo: string | null;
            openingTime: string | null;
            closingTime: string | null;
            status: import(".prisma/client").$Enums.BranchStatus;
            deletedAt: Date | null;
        } | null;
        isActive: boolean;
        roles: string[];
    }>;
    getRoles(): Promise<({
        rolePermissions: ({
            permission: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                module: string;
            };
        } & {
            id: string;
            createdAt: Date;
            roleId: string;
            permissionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isSystem: boolean;
    })[]>;
    getPermissions(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        module: string;
    }[]>;
}
