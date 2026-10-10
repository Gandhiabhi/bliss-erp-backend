import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { resolveBranchId } from '../../common/utils/branch-filter.js';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(user: AuthenticatedUser, requestedBranchId?: string) {
    const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
    const effectiveBranchId = resolveBranchId(user, requestedBranchId);

    // Get global settings (branchId = null) and branch settings
    const where: any = effectiveBranchId
      ? { OR: [{ branchId: effectiveBranchId }, { branchId: null }] }
      : isSuperAdmin
      ? {}
      : { branchId: null };

    const settings = await this.prisma.setting.findMany({
      where,
      orderBy: { key: 'asc' },
    });

    const branch = effectiveBranchId
      ? await this.prisma.branch.findUnique({ where: { id: effectiveBranchId } })
      : null;

    return {
      branch,
      settings: settings.reduce((acc: Record<string, any>, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {}),
    };
  }

  async updateSetting(
    key: string,
    value: any,
    user: AuthenticatedUser,
    requestedBranchId?: string
  ) {
    const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
    let branchId = requestedBranchId || null;

    if (!isSuperAdmin) {
      if (!user.branchId) {
        throw new ForbiddenException('User has no branch assigned');
      }
      branchId = user.branchId;
    }

    const setting = await this.prisma.setting.upsert({
      where: {
        branchId_key: {
          branchId: branchId as any,
          key,
        },
      },
      update: { value },
      create: {
        branchId,
        key,
        value,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorName: `${user.firstName} ${user.lastName}`,
        branchId,
        action: 'SETTING_UPDATED',
        entityType: 'Setting',
        entityId: setting.id,
        afterData: { key, value },
      },
    });

    return setting;
  }
}
