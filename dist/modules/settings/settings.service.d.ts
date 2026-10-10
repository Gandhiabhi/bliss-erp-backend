import { PrismaService } from '../../database/prisma.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(user: AuthenticatedUser, requestedBranchId?: string): Promise<{
        branch: {
            email: string | null;
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchCode: string;
            country: string;
            state: string | null;
            city: string;
            address: string | null;
            timezone: string;
            currency: string;
            logo: string | null;
            openingTime: string | null;
            closingTime: string | null;
            status: import(".prisma/client").$Enums.BranchStatus;
            deletedAt: Date | null;
        } | null;
        settings: Record<string, any>;
    }>;
    updateSetting(key: string, value: any, user: AuthenticatedUser, requestedBranchId?: string): Promise<{
        id: string;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
