import { PrismaService } from '../../database/prisma.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDailyReport(user: AuthenticatedUser, dateStr?: string, branchId?: string): Promise<{
        date: string;
        totalVisits: any;
        newCustomers: any;
        totalRevenue: any;
        totalPaymentsCount: any;
        membershipsSoldCount: any;
        totalServicesConsumed: any;
        servicesBreakdown: {
            name: string;
            count: number;
        }[];
        paymentsList: any;
    }>;
    getMonthlyReport(user: AuthenticatedUser, year?: number, month?: number, branchId?: string): Promise<{
        year: number;
        month: number;
        totalVisits: any;
        totalCustomers: any;
        newCustomers: any;
        returningCustomers: number;
        totalRevenue: any;
        membershipsSold: any;
        servicesConsumed: any;
        dailyBreakdown: {
            day: number;
            date: string;
            visits: any;
            revenue: any;
        }[];
    }>;
    getYearlyReport(user: AuthenticatedUser, year?: number, branchId?: string): Promise<{
        year: number;
        totalRevenue: any;
        totalVisits: any;
        totalMembershipsSold: any;
        totalNewCustomers: any;
        monthlyBreakdown: {
            month: string;
            monthIndex: number;
            revenue: any;
            visits: any;
            memberships: any;
            newCustomers: any;
        }[];
    }>;
    getBranchComparisonReport(user: AuthenticatedUser): Promise<any>;
    getServiceUsageReport(user: AuthenticatedUser, branchId?: string): Promise<{
        totalServicesDelivered: number;
        totalDeliveredValue: number;
        services: {
            serviceName: string;
            code: string;
            count: number;
            totalValue: number;
        }[];
    }>;
    getMembershipReport(user: AuthenticatedUser, branchId?: string): Promise<{
        totalMemberships: any;
        totalValue: any;
        statusBreakdown: {
            active: any;
            paused: any;
            expired: any;
            cancelled: any;
            completed: any;
        };
        planTypes: {
            standardTemplate: number;
            customClientPlan: any;
        };
    }>;
}
