import { PrismaService } from '../../database/prisma.service.js';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class PlansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser, query?: {
        branchId?: string;
        search?: string;
        status?: string;
    }): Promise<any>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreatePlanDto, actor: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdatePlanDto, actor: AuthenticatedUser): Promise<any>;
    remove(id: string, actor: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
