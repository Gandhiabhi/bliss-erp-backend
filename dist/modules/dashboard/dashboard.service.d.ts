import { PrismaService } from '../../database/prisma.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(user: AuthenticatedUser, requestedBranchId?: string): Promise<{
        isSuperAdmin: boolean;
        effectiveBranchId: string | null;
        stats: {
            totalBranches: any;
            activeBranches: any;
            totalCustomers: any;
            newCustomersToday: any;
            activeMemberships: any;
            expiringMemberships: any;
            todayVisits: any;
            todayRevenue: any;
            monthRevenue: any;
        };
        recentVisits: any;
        upcomingAppointments: any;
        recentAuditLogs: any;
        branchSummaries: any;
    }>;
}
