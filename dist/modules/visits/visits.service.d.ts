import { PrismaService } from '../../database/prisma.service.js';
import { CreateVisitDto, UpdateVisitStatusDto } from './dto/visit.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class VisitsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser, query?: {
        branchId?: string;
        customerId?: string;
        date?: string;
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
    create(dto: CreateVisitDto, actor: AuthenticatedUser): Promise<any>;
    updateStatus(id: string, dto: UpdateVisitStatusDto, actor: AuthenticatedUser): Promise<any>;
}
