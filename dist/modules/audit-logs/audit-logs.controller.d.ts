import { AuditLogsService } from './audit-logs.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    findAll(user: AuthenticatedUser, branchId?: string, action?: string, entityType?: string, search?: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
}
