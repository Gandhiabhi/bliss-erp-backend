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
import { UsersService } from './users.service.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string,
    @Query('search') search?: string
  ) {
    return this.usersService.findAll(user, { branchId, search });
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Get('roles')
  async getRoles() {
    return this.usersService.getRoles();
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Get('permissions')
  async getPermissions() {
    return this.usersService.getPermissions();
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.usersService.findOne(id, user);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Post()
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.usersService.create(dto, user);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.usersService.update(id, dto, user);
  }
}
