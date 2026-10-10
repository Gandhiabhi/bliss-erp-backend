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
import { VisitsService } from './visits.service.js';
import { CreateVisitDto, UpdateVisitStatusDto } from './dto/visit.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string,
    @Query('customerId') customerId?: string,
    @Query('date') date?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.visitsService.findAll(user, {
      branchId,
      customerId,
      date,
      status,
      search,
      page,
      limit,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.visitsService.findOne(id, user);
  }

  @Post()
  async create(
    @Body() dto: CreateVisitDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.visitsService.create(dto, user);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVisitStatusDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.visitsService.updateStatus(id, dto, user);
  }
}
