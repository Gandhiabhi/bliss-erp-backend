import { DashboardService } from './dashboard.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(user: AuthenticatedUser, branchId?: string): Promise<{
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
