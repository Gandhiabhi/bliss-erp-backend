import { PrismaService } from '../../database/prisma.service.js';
import { CreateMembershipDto, UpdateMembershipStatusDto } from './dto/membership.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class MembershipsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser, query?: {
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
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreateMembershipDto, actor: AuthenticatedUser): Promise<any>;
    updateStatus(id: string, dto: UpdateMembershipStatusDto, actor: AuthenticatedUser): Promise<any>;
    getExpiringSoon(user: AuthenticatedUser, days?: number): Promise<any>;
}
