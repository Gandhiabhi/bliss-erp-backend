import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string
  ) {
    return this.settingsService.getSettings(user, branchId);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Put(':key')
  async updateSetting(
    @Param('key') key: string,
    @Body() body: { value: any; branchId?: string },
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.settingsService.updateSetting(key, body.value, user, body.branchId);
  }
}
