import { ReportsService } from './reports.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDailyReport(user: AuthenticatedUser, date?: string, branchId?: string): Promise<{
        date: string;
        totalVisits: number;
        newCustomers: number;
        totalRevenue: number;
        totalPaymentsCount: number;
        membershipsSoldCount: number;
        totalServicesConsumed: number;
        servicesBreakdown: {
            name: string;
            count: number;
        }[];
        paymentsList: {
            id: string;
            code: string;
            amount: number;
            currency: string;
            method: import(".prisma/client").$Enums.PaymentMethod;
            date: Date;
        }[];
    }>;
    getMonthlyReport(user: AuthenticatedUser, year?: number, month?: number, branchId?: string): Promise<{
        year: number;
        month: number;
        totalVisits: number;
        totalCustomers: number;
        newCustomers: number;
        returningCustomers: number;
        totalRevenue: number;
        membershipsSold: number;
        servicesConsumed: number;
        dailyBreakdown: {
            day: number;
            date: string;
            visits: number;
            revenue: number;
        }[];
    }>;
    getYearlyReport(user: AuthenticatedUser, year?: number, branchId?: string): Promise<{
        year: number;
        totalRevenue: number;
        totalVisits: number;
        totalMembershipsSold: number;
        totalNewCustomers: number;
        monthlyBreakdown: {
            month: string;
            monthIndex: number;
            revenue: number;
            visits: number;
            memberships: number;
            newCustomers: number;
        }[];
    }>;
    getBranchComparisonReport(user: AuthenticatedUser): Promise<{
        branchId: string;
        branchCode: string;
        branchName: string;
        country: string;
        city: string;
        currency: string;
        timezone: string;
        status: import(".prisma/client").$Enums.BranchStatus;
        totalCustomers: number;
        totalStaff: number;
        totalVisits: number;
        totalMemberships: number;
        totalRevenue: number;
    }[]>;
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
        totalMemberships: number;
        totalValue: number;
        statusBreakdown: {
            active: number;
            paused: number;
            expired: number;
            cancelled: number;
            completed: number;
        };
        planTypes: {
            standardTemplate: number;
            customClientPlan: number;
        };
    }>;
}
