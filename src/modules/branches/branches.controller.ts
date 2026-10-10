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
import { BranchesService } from './branches.service.js';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('search') search?: string,
    @Query('status') status?: string
  ) {
    return this.branchesService.findAll(user, { search, status });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.branchesService.findOne(id, user);
  }

  @Roles('SUPER_ADMIN')
  @Post()
  async create(
    @Body() dto: CreateBranchDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.branchesService.create(dto, user);
  }

  @Roles('SUPER_ADMIN', 'BRANCH_MANAGER')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.branchesService.update(id, dto, user);
  }

  @Roles('SUPER_ADMIN')
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.branchesService.remove(id, user);
  }
}
