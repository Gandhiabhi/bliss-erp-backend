import { PlansService } from './plans.service.js';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    findAll(user: AuthenticatedUser, branchId?: string, search?: string, status?: string): Promise<any>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreatePlanDto, user: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdatePlanDto, user: AuthenticatedUser): Promise<any>;
    remove(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
