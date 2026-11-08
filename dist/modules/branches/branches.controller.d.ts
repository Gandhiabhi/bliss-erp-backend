import { BranchesService } from './branches.service.js';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    findAll(user: AuthenticatedUser, search?: string, status?: string): Promise<any>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreateBranchDto, user: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdateBranchDto, user: AuthenticatedUser): Promise<any>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
