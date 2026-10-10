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
let AuditLogsService = class AuditLogsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(user, query) {
        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
        const isManager = user.roles.includes('BRANCH_MANAGER') || user.roles.includes('ADMIN');
        if (!isSuperAdmin && !isManager) {
            throw new ForbiddenException('Audit logs are only accessible to administrators and managers');
        }
        const effectiveBranchId = resolveBranchId(user, query?.branchId);
        const where = {};
        if (effectiveBranchId) {
            where.branchId = effectiveBranchId;
        }
        if (query?.action) {
            where.action = query.action;
        }
        if (query?.entityType) {
            where.entityType = query.entityType;
        }
        if (query?.search) {
            where.OR = [
                { actorName: { contains: query.search, mode: 'insensitive' } },
                { action: { contains: query.search, mode: 'insensitive' } },
                { entityType: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const page = Math.max(1, Number(query?.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(query?.limit) || 25));
        const skip = (page - 1) * limit;
        const [total, logs] = await Promise.all([
            this.prisma.auditLog.count({ where }),
            this.prisma.auditLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    branch: { select: { id: true, name: true, branchCode: true } },
                    actor: { select: { id: true, email: true } },
                },
            }),
        ]);
        return {
            data: logs,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
AuditLogsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AuditLogsService);
export { AuditLogsService };
//# sourceMappingURL=audit-logs.service.js.map