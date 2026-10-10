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
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings(user, requestedBranchId) {
        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
        const effectiveBranchId = resolveBranchId(user, requestedBranchId);
        const where = effectiveBranchId
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
            settings: settings.reduce((acc, s) => {
                acc[s.key] = s.value;
                return acc;
            }, {}),
        };
    }
    async updateSetting(key, value, user, requestedBranchId) {
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
                    branchId: branchId,
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
};
SettingsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], SettingsService);
export { SettingsService };
//# sourceMappingURL=settings.service.js.map