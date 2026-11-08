import { SettingsService } from './settings.service.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(user: AuthenticatedUser, branchId?: string): Promise<{
        branch: any;
        settings: any;
    }>;
    updateSetting(key: string, body: {
        value: any;
        branchId?: string;
    }, user: AuthenticatedUser): Promise<any>;
}
