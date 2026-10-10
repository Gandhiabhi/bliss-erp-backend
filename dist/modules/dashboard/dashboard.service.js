var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { resolveBranchId } from '../../common/utils/branch-filter.js';
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(user, requestedBranchId) {
        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
        const effectiveBranchId = resolveBranchId(user, requestedBranchId);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const branchFilter = effectiveBranchId ? { branchId: effectiveBranchId } : {};
        const [totalBranches, activeBranches, totalCustomers, newCustomersToday, activeMemberships, expiringMemberships, todayVisits, todayPayments, monthPayments, recentVisits, upcomingAppointments, recentAuditLogs,] = await Promise.all([
            this.prisma.branch.count({ where: { deletedAt: null } }),
            this.prisma.branch.count({ where: { status: 'ACTIVE', deletedAt: null } }),
            this.prisma.customer.count({ where: { ...branchFilter, deletedAt: null } }),
            this.prisma.customer.count({
                where: { ...branchFilter, createdAt: { gte: startOfToday, lte: endOfToday } },
            }),
            this.prisma.membership.count({
                where: { ...branchFilter, status: 'ACTIVE' },
            }),
            this.prisma.membership.count({
                where: {
                    ...branchFilter,
                    status: 'ACTIVE',
                    endDate: { gte: now, lte: sevenDaysLater },
                },
            }),
            this.prisma.visit.count({
                where: {
                    ...branchFilter,
                    visitDate: { gte: startOfToday, lte: endOfToday },
                },
            }),
            this.prisma.payment.findMany({
                where: {
                    ...branchFilter,
                    status: 'PAID',
                    paymentDate: { gte: startOfToday, lte: endOfToday },
                },
                select: { amount: true, currency: true },
            }),
            this.prisma.payment.findMany({
                where: {
                    ...branchFilter,
                    status: 'PAID',
                    paymentDate: { gte: startOfMonth, lte: endOfMonth },
                },
                select: { amount: true, currency: true },
            }),
            this.prisma.visit.findMany({
                where: { ...branchFilter },
                take: 5,
                orderBy: { visitDate: 'desc' },
                include: {
                    customer: { select: { id: true, displayName: true, phone: true } },
                    visitServices: {
                        include: { service: { select: { name: true } }, staff: { select: { name: true } } },
                    },
                },
            }),
            this.prisma.appointment.findMany({
                where: {
                    ...branchFilter,
                    scheduledDate: { gte: startOfToday },
                    status: { in: ['CONFIRMED', 'PENDING'] },
                },
                take: 5,
                orderBy: [{ scheduledDate: 'asc' }, { startTime: 'asc' }],
                include: {
                    customer: { select: { id: true, displayName: true } },
                    service: { select: { name: true } },
                    staff: { select: { name: true } },
                },
            }),
            isSuperAdmin
                ? this.prisma.auditLog.findMany({
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: { branch: { select: { name: true } } },
                })
                : [],
        ]);
        const todayRevenue = todayPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const monthRevenue = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        let branchSummaries = null;
        if (isSuperAdmin && !effectiveBranchId) {
            const allBranches = await this.prisma.branch.findMany({
                where: { deletedAt: null },
                include: {
                    _count: {
                        select: { customers: true, memberships: true, visits: true },
                    },
                    payments: {
                        where: { status: 'PAID', paymentDate: { gte: startOfMonth, lte: endOfMonth } },
                        select: { amount: true },
                    },
                },
            });
            branchSummaries = allBranches.map((b) => ({
                id: b.id,
                name: b.name,
                code: b.branchCode,
                city: b.city,
                country: b.country,
                currency: b.currency,
                status: b.status,
                customersCount: b._count.customers,
                membershipsCount: b._count.memberships,
                visitsCount: b._count.visits,
                monthlyRevenue: b.payments.reduce((s, p) => s + Number(p.amount), 0),
            }));
        }
        return {
            isSuperAdmin,
            effectiveBranchId: effectiveBranchId || null,
            stats: {
                totalBranches,
                activeBranches,
                totalCustomers,
                newCustomersToday,
                activeMemberships,
                expiringMemberships,
                todayVisits,
                todayRevenue,
                monthRevenue,
            },
            recentVisits,
            upcomingAppointments,
            recentAuditLogs,
            branchSummaries,
        };
    }
};
DashboardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map