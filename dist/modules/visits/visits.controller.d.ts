import { VisitsService } from './visits.service.js';
import { CreateVisitDto, UpdateVisitStatusDto } from './dto/visit.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class VisitsController {
    private readonly visitsService;
    constructor(visitsService: VisitsService);
    findAll(user: AuthenticatedUser, branchId?: string, customerId?: string, date?: string, status?: string, search?: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreateVisitDto, user: AuthenticatedUser): Promise<any>;
    updateStatus(id: string, dto: UpdateVisitStatusDto, user: AuthenticatedUser): Promise<any>;
}
