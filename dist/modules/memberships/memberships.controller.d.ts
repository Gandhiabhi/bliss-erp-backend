import { MembershipsService } from './memberships.service.js';
import { CreateMembershipDto, UpdateMembershipStatusDto } from './dto/membership.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class MembershipsController {
    private readonly membershipsService;
    constructor(membershipsService: MembershipsService);
    findAll(user: AuthenticatedUser, branchId?: string, customerId?: string, status?: string, search?: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getExpiringSoon(user: AuthenticatedUser, days?: number): Promise<any>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreateMembershipDto, user: AuthenticatedUser): Promise<any>;
    updateStatus(id: string, dto: UpdateMembershipStatusDto, user: AuthenticatedUser): Promise<any>;
}
