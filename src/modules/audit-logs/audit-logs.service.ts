import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { resolveBranchId } from '../../common/utils/branch-filter.js';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    user: AuthenticatedUser,
    query?: {
      branchId?: string;
      action?: string;
      entityType?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
    const isManager = user.roles.includes('BRANCH_MANAGER') || user.roles.includes('ADMIN');

    if (!isSuperAdmin && !isManager) {
      throw new ForbiddenException('Audit logs are only accessible to administrators and managers');
    }

    const effectiveBranchId = resolveBranchId(user, query?.branchId);

    const where: any = {};
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
}
