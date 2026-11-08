import { PrismaService } from '../../database/prisma.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(user: AuthenticatedUser, requestedBranchId?: string): Promise<{
        branch: any;
        settings: any;
    }>;
    updateSetting(key: string, value: any, user: AuthenticatedUser, requestedBranchId?: string): Promise<any>;
}
