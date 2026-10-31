import { BranchesService } from './branches.service.js';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    findAll(user: AuthenticatedUser, search?: string, status?: string): Promise<({
        _count: {
            staff: number;
            customers: number;
            memberships: number;
            visits: number;
        };
    } & {
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
    })[]>;
    findOne(id: string, user: AuthenticatedUser): Promise<{
        staff: {
            email: string | null;
            id: string;
            phone: string | null;
            branchId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string | null;
            address: string | null;
            status: string;
            deletedAt: Date | null;
            notes: string | null;
            staffCode: string;
            gender: string | null;
            dateOfBirth: Date | null;
            emergencyContact: string | null;
            position: string | null;
            specialization: string | null;
            joiningDate: Date | null;
            profileImage: string | null;
        }[];
        users: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            userRoles: ({
                role: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    isSystem: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                userId: string;
                roleId: string;
            })[];
        }[];
        _count: {
            customers: number;
            memberships: number;
            visits: number;
        };
    } & {
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
    }>;
    create(dto: CreateBranchDto, user: AuthenticatedUser): Promise<{
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
    }>;
    update(id: string, dto: UpdateBranchDto, user: AuthenticatedUser): Promise<{
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
    }>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
