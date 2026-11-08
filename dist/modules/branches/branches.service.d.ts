import { PrismaService } from '../../database/prisma.service.js';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class BranchesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser, query?: {
        search?: string;
        status?: string;
    }): Promise<any>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreateBranchDto, actor: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdateBranchDto, actor: AuthenticatedUser): Promise<any>;
    remove(id: string, actor: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
