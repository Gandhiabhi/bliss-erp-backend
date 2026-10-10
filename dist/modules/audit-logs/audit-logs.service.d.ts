import { PrismaService } from '../../database/prisma.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class AuditLogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser, query?: {
        branchId?: string;
        action?: string;
        entityType?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            branch: {
                id: string;
                name: string;
                branchCode: string;
            } | null;
            actor: {
                email: string;
                id: string;
            } | null;
        } & {
            id: string;
            branchId: string | null;
            createdAt: Date;
            actorName: string;
            action: string;
            entityType: string;
            entityId: string;
            beforeData: import("@prisma/client/runtime/library").JsonValue | null;
            afterData: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
            actorId: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
