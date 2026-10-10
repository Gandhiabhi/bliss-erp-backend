import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service.js';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string,
    @Query('search') search?: string,
    @Query('status') status?: string
  ) {
    return this.plansService.findAll(user, { branchId, search, status });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.plansService.findOne(id, user);
  }

  @Post()
  async create(
    @Body() dto: CreatePlanDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.plansService.create(dto, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.plansService.update(id, dto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.plansService.remove(id, user);
  }
}
