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
import { StaffService } from './staff.service.js';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string,
    @Query('search') search?: string,
    @Query('status') status?: string
  ) {
    return this.staffService.findAll(user, { branchId, search, status });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.staffService.findOne(id, user);
  }

  @Post()
  async create(
    @Body() dto: CreateStaffDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.staffService.create(dto, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.staffService.update(id, dto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.staffService.remove(id, user);
  }
}
