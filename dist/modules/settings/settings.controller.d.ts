import { SettingsService } from './settings.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(user: AuthenticatedUser, branchId?: string): Promise<{
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
    updateSetting(key: string, body: {
        value: any;
        branchId?: string;
    }, user: AuthenticatedUser): Promise<{
        id: string;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
