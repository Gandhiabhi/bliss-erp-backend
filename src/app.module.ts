import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { PrismaModule } from './database/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { BranchesModule } from './modules/branches/branches.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { ServicesModule } from './modules/services/services.module.js';
import { StaffModule } from './modules/staff/staff.module.js';
import { PlansModule } from './modules/plans/plans.module.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { MembershipsModule } from './modules/memberships/memberships.module.js';
import { VisitsModule } from './modules/visits/visits.module.js';
import { AppointmentsModule } from './modules/appointments/appointments.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { ReportsModule } from './modules/reports/reports.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';
import { UploadsModule } from './modules/uploads/uploads.module.js';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120, // 120 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    BranchesModule,
    UsersModule,
    ServicesModule,
    StaffModule,
    PlansModule,
    CustomersModule,
    MembershipsModule,
    VisitsModule,
    AppointmentsModule,
    PaymentsModule,
    ReportsModule,
    DashboardModule,
    AuditLogsModule,
    SettingsModule,
    UploadsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
