import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  async getDailyReport(
    @CurrentUser() user: AuthenticatedUser,
    @Query('date') date?: string,
    @Query('branchId') branchId?: string
  ) {
    return this.reportsService.getDailyReport(user, date, branchId);
  }

  @Get('monthly')
  async getMonthlyReport(
    @CurrentUser() user: AuthenticatedUser,
    @Query('year') year?: number,
    @Query('month') month?: number,
    @Query('branchId') branchId?: string
  ) {
    return this.reportsService.getMonthlyReport(
      user,
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
      branchId
    );
  }

  @Get('yearly')
  async getYearlyReport(
    @CurrentUser() user: AuthenticatedUser,
    @Query('year') year?: number,
    @Query('branchId') branchId?: string
  ) {
    return this.reportsService.getYearlyReport(user, year ? Number(year) : undefined, branchId);
  }

  @Get('branch-comparison')
  async getBranchComparisonReport(@CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.getBranchComparisonReport(user);
  }

  @Get('services')
  async getServiceUsageReport(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string
  ) {
    return this.reportsService.getServiceUsageReport(user, branchId);
  }

  @Get('memberships')
  async getMembershipReport(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string
  ) {
    return this.reportsService.getMembershipReport(user, branchId);
  }
}
