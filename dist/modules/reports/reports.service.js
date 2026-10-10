var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { resolveBranchId } from '../../common/utils/branch-filter.js';
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDailyReport(user, dateStr, branchId) {
        const effectiveBranchId = resolveBranchId(user, branchId);
        const targetDate = dateStr ? new Date(dateStr) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const branchFilter = effectiveBranchId ? { branchId: effectiveBranchId } : {};
        const [visits, newCustomers, payments, memberships, visitServices] = await Promise.all([
            this.prisma.visit.count({
                where: {
                    ...branchFilter,
                    visitDate: { gte: startOfDay, lte: endOfDay },
                },
            }),
            this.prisma.customer.count({
                where: {
                    ...branchFilter,
                    createdAt: { gte: startOfDay, lte: endOfDay },
                },
            }),
            this.prisma.payment.findMany({
                where: {
                    ...branchFilter,
                    status: 'PAID',
                    paymentDate: { gte: startOfDay, lte: endOfDay },
                },
            }),
            this.prisma.membership.findMany({
                where: {
                    ...branchFilter,
                    createdAt: { gte: startOfDay, lte: endOfDay },
                },
                include: { customer: true },
            }),
            this.prisma.visitService.findMany({
                where: {
                    visit: {
                        ...branchFilter,
                        visitDate: { gte: startOfDay, lte: endOfDay },
                    },
                },
                include: { service: true },
            }),
        ]);
        const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const totalServicesConsumed = visitServices.reduce((sum, vs) => sum + vs.quantity, 0);
        const serviceMap = new Map();
        for (const vs of visitServices) {
            const name = vs.serviceNameSnapshot || vs.service.name;
            serviceMap.set(name, (serviceMap.get(name) || 0) + vs.quantity);
        }
        return {
            date: startOfDay.toISOString().split('T')[0],
            totalVisits: visits,
            newCustomers,
            totalRevenue,
            totalPaymentsCount: payments.length,
            membershipsSoldCount: memberships.length,
            totalServicesConsumed,
            servicesBreakdown: Array.from(serviceMap.entries()).map(([name, count]) => ({
                name,
                count,
            })),
            paymentsList: payments.map((p) => ({
                id: p.id,
                code: p.paymentCode,
                amount: Number(p.amount),
                currency: p.currency,
                method: p.paymentMethod,
                date: p.paymentDate,
            })),
        };
    }
    async getMonthlyReport(user, year, month, branchId) {
        const effectiveBranchId = resolveBranchId(user, branchId);
        const now = new Date();
        const targetYear = year || now.getFullYear();
        const targetMonth = month !== undefined ? month : now.getMonth() + 1;
        const startOfMonth = new Date(targetYear, targetMonth - 1, 1, 0, 0, 0, 0);
        const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);
        const branchFilter = effectiveBranchId ? { branchId: effectiveBranchId } : {};
        const [visits, customersTotal, newCustomers, payments, memberships, visitServices] = await Promise.all([
            this.prisma.visit.findMany({
                where: {
                    ...branchFilter,
                    visitDate: { gte: startOfMonth, lte: endOfMonth },
                },
                select: { id: true, visitDate: true, customerId: true },
            }),
            this.prisma.customer.count({
                where: { ...branchFilter },
            }),
            this.prisma.customer.count({
                where: {
                    ...branchFilter,
                    createdAt: { gte: startOfMonth, lte: endOfMonth },
                },
            }),
            this.prisma.payment.findMany({
                where: {
                    ...branchFilter,
                    status: 'PAID',
                    paymentDate: { gte: startOfMonth, lte: endOfMonth },
                },
                select: { amount: true, currency: true, paymentDate: true, paymentMethod: true },
            }),
            this.prisma.membership.findMany({
                where: {
                    ...branchFilter,
                    createdAt: { gte: startOfMonth, lte: endOfMonth },
                },
                select: { id: true, finalAmount: true, name: true, createdAt: true },
            }),
            this.prisma.visitService.findMany({
                where: {
                    visit: {
                        ...branchFilter,
                        visitDate: { gte: startOfMonth, lte: endOfMonth },
                    },
                },
                select: { serviceNameSnapshot: true, quantity: true, unitPriceSnapshot: true },
            }),
        ]);
        const totalRevenue = payments.reduce((acc, p) => acc + Number(p.amount), 0);
        const totalServicesConsumed = visitServices.reduce((acc, vs) => acc + vs.quantity, 0);
        const daysInMonth = endOfMonth.getDate();
        const dailyBreakdown = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(targetYear, targetMonth - 1, day);
            const dateStr = dayDate.toISOString().split('T')[0];
            const dayVisits = visits.filter((v) => new Date(v.visitDate).toISOString().split('T')[0] === dateStr).length;
            const dayRevenue = payments
                .filter((p) => new Date(p.paymentDate).toISOString().split('T')[0] === dateStr)
                .reduce((sum, p) => sum + Number(p.amount), 0);
            dailyBreakdown.push({
                day,
                date: dateStr,
                visits: dayVisits,
                revenue: dayRevenue,
            });
        }
        return {
            year: targetYear,
            month: targetMonth,
            totalVisits: visits.length,
            totalCustomers: customersTotal,
            newCustomers,
            returningCustomers: Math.max(0, visits.length - newCustomers),
            totalRevenue,
            membershipsSold: memberships.length,
            servicesConsumed: totalServicesConsumed,
            dailyBreakdown,
        };
    }
    async getYearlyReport(user, year, branchId) {
        const effectiveBranchId = resolveBranchId(user, branchId);
        const targetYear = year || new Date().getFullYear();
        const startOfYear = new Date(targetYear, 0, 1, 0, 0, 0, 0);
        const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);
        const branchFilter = effectiveBranchId ? { branchId: effectiveBranchId } : {};
        const [payments, visits, memberships, customers] = await Promise.all([
            this.prisma.payment.findMany({
                where: {
                    ...branchFilter,
                    status: 'PAID',
                    paymentDate: { gte: startOfYear, lte: endOfYear },
                },
                select: { amount: true, paymentDate: true },
            }),
            this.prisma.visit.findMany({
                where: {
                    ...branchFilter,
                    visitDate: { gte: startOfYear, lte: endOfYear },
                },
                select: { visitDate: true },
            }),
            this.prisma.membership.findMany({
                where: {
                    ...branchFilter,
                    createdAt: { gte: startOfYear, lte: endOfYear },
                },
                select: { finalAmount: true, createdAt: true },
            }),
            this.prisma.customer.findMany({
                where: {
                    ...branchFilter,
                    createdAt: { gte: startOfYear, lte: endOfYear },
                },
                select: { createdAt: true },
            }),
        ]);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyBreakdown = monthNames.map((name, index) => {
            const monthPayments = payments.filter((p) => new Date(p.paymentDate).getMonth() === index);
            const monthVisits = visits.filter((v) => new Date(v.visitDate).getMonth() === index);
            const monthMemberships = memberships.filter((m) => new Date(m.createdAt).getMonth() === index);
            const monthNewCust = customers.filter((c) => new Date(c.createdAt).getMonth() === index);
            return {
                month: name,
                monthIndex: index + 1,
                revenue: monthPayments.reduce((s, p) => s + Number(p.amount), 0),
                visits: monthVisits.length,
                memberships: monthMemberships.length,
                newCustomers: monthNewCust.length,
            };
        });
        const totalRevenue = payments.reduce((acc, p) => acc + Number(p.amount), 0);
        return {
            year: targetYear,
            totalRevenue,
            totalVisits: visits.length,
            totalMembershipsSold: memberships.length,
            totalNewCustomers: customers.length,
            monthlyBreakdown,
        };
    }
    async getBranchComparisonReport(user) {
        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin) {
            throw new ForbiddenException('Branch comparison is only accessible to Central Administrators');
        }
        const branches = await this.prisma.branch.findMany({
            where: { deletedAt: null },
            include: {
                _count: {
                    select: {
                        customers: true,
                        staff: true,
                        visits: true,
                        memberships: true,
                        payments: true,
                    },
                },
                payments: {
                    where: { status: 'PAID' },
                    select: { amount: true, currency: true },
                },
            },
        });
        return branches.map((b) => {
            const totalRevenue = b.payments.reduce((sum, p) => sum + Number(p.amount), 0);
            return {
                branchId: b.id,
                branchCode: b.branchCode,
                branchName: b.name,
                country: b.country,
                city: b.city,
                currency: b.currency,
                timezone: b.timezone,
                status: b.status,
                totalCustomers: b._count.customers,
                totalStaff: b._count.staff,
                totalVisits: b._count.visits,
                totalMemberships: b._count.memberships,
                totalRevenue,
            };
        });
    }
    async getServiceUsageReport(user, branchId) {
        const effectiveBranchId = resolveBranchId(user, branchId);
        const branchFilter = effectiveBranchId ? { branchId: effectiveBranchId } : {};
        const visitServices = await this.prisma.visitService.findMany({
            where: {
                visit: branchFilter,
            },
            include: {
                service: { select: { id: true, name: true, code: true, defaultPrice: true, currency: true } },
            },
        });
        const usageMap = new Map();
        for (const vs of visitServices) {
            const sId = vs.serviceId;
            const existing = usageMap.get(sId) || {
                serviceName: vs.serviceNameSnapshot || vs.service.name,
                code: vs.service.code,
                count: 0,
                totalValue: 0,
            };
            existing.count += vs.quantity;
            existing.totalValue += Number(vs.unitPriceSnapshot) * vs.quantity;
            usageMap.set(sId, existing);
        }
        const items = Array.from(usageMap.values()).sort((a, b) => b.count - a.count);
        return {
            totalServicesDelivered: items.reduce((acc, i) => acc + i.count, 0),
            totalDeliveredValue: items.reduce((acc, i) => acc + i.totalValue, 0),
            services: items,
        };
    }
    async getMembershipReport(user, branchId) {
        const effectiveBranchId = resolveBranchId(user, branchId);
        const branchFilter = effectiveBranchId ? { branchId: effectiveBranchId } : {};
        const [active, paused, expired, cancelled, completed, all] = await Promise.all([
            this.prisma.membership.count({ where: { ...branchFilter, status: 'ACTIVE' } }),
            this.prisma.membership.count({ where: { ...branchFilter, status: 'PAUSED' } }),
            this.prisma.membership.count({ where: { ...branchFilter, status: 'EXPIRED' } }),
            this.prisma.membership.count({ where: { ...branchFilter, status: 'CANCELLED' } }),
            this.prisma.membership.count({ where: { ...branchFilter, status: 'COMPLETED' } }),
            this.prisma.membership.findMany({
                where: { ...branchFilter },
                select: { price: true, finalAmount: true, isCustomPlan: true, planTemplate: { select: { name: true } } },
            }),
        ]);
        const totalValue = all.reduce((sum, m) => sum + Number(m.finalAmount), 0);
        const customPlansCount = all.filter((m) => m.isCustomPlan).length;
        const templatePlansCount = all.length - customPlansCount;
        return {
            totalMemberships: all.length,
            totalValue,
            statusBreakdown: {
                active,
                paused,
                expired,
                cancelled,
                completed,
            },
            planTypes: {
                standardTemplate: templatePlansCount,
                customClientPlan: customPlansCount,
            },
        };
    }
};
ReportsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ReportsService);
export { ReportsService };
//# sourceMappingURL=reports.service.js.map