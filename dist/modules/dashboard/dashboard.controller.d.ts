import { DashboardService } from './dashboard.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(user: AuthenticatedUser, branchId?: string): Promise<{
        isSuperAdmin: boolean;
        effectiveBranchId: string | null;
        stats: {
            totalBranches: number;
            activeBranches: number;
            totalCustomers: number;
            newCustomersToday: number;
            activeMemberships: number;
            expiringMemberships: number;
            todayVisits: number;
            todayRevenue: number;
            monthRevenue: number;
        };
        recentVisits: ({
            customer: {
                id: string;
                phone: string;
                displayName: string;
            };
            visitServices: ({
                staff: {
                    name: string;
                } | null;
                service: {
                    name: string;
                };
            } & {
                id: string;
                createdAt: Date;
                status: string;
                notes: string | null;
                serviceId: string;
                quantity: number;
                serviceVariantId: string | null;
                serviceNameSnapshot: string;
                variantNameSnapshot: string | null;
                unitPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
                currencySnapshot: string;
                visitId: string;
                membershipServiceId: string | null;
                staffId: string | null;
            })[];
        } & {
            id: string;
            branchId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VisitStatus;
            notes: string | null;
            membershipId: string | null;
            customerId: string;
            createdById: string | null;
            visitDate: Date;
            visitCode: string;
            checkInTime: Date;
            checkOutTime: Date | null;
        })[];
        upcomingAppointments: ({
            customer: {
                id: string;
                displayName: string;
            };
            staff: {
                name: string;
            } | null;
            service: {
                name: string;
            };
        } & {
            id: string;
            branchId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            notes: string | null;
            serviceId: string;
            serviceVariantId: string | null;
            staffId: string | null;
            appointmentCode: string;
            scheduledDate: Date;
            startTime: string;
            endTime: string;
            customerId: string;
        })[];
        recentAuditLogs: never[] | ({
            branch: {
                name: string;
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
        branchSummaries: {
            id: string;
            name: string;
            code: string;
            city: string;
            country: string;
            currency: string;
            status: import(".prisma/client").$Enums.BranchStatus;
            customersCount: number;
            membershipsCount: number;
            visitsCount: number;
            monthlyRevenue: number;
        }[] | null;
    }>;
}
