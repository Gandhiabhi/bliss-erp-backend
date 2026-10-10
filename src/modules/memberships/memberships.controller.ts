import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service.js';
import {
  CreateMembershipDto,
  UpdateMembershipStatusDto,
} from './dto/membership.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string,
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.membershipsService.findAll(user, {
      branchId,
      customerId,
      status,
      search,
      page,
      limit,
    });
  }

  @Get('expiring-soon')
  async getExpiringSoon(
    @CurrentUser() user: AuthenticatedUser,
    @Query('days') days?: number
  ) {
    return this.membershipsService.getExpiringSoon(user, days ? Number(days) : 7);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.membershipsService.findOne(id, user);
  }

  @Post()
  async create(
    @Body() dto: CreateMembershipDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.membershipsService.create(dto, user);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateMembershipStatusDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.membershipsService.updateStatus(id, dto, user);
  }
}
