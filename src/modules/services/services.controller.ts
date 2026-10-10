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
import { ServicesService } from './services.service.js';
import {
  CreateServiceDto,
  UpdateServiceDto,
  CreateVariantDto,
  UpdateVariantDto,
  SetBranchPriceDto,
  CreateCategoryDto,
} from './dto/service.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('categories')
  async getCategories() {
    return this.servicesService.getCategories();
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Post('categories')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.servicesService.createCategory(dto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('branchId') branchId?: string
  ) {
    return this.servicesService.findAll(user, { search, categoryId, branchId });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string
  ) {
    return this.servicesService.findOne(id, user, branchId);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Post()
  async create(
    @Body() dto: CreateServiceDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.servicesService.create(dto, user);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.servicesService.update(id, dto, user);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Post(':id/variants')
  async addVariant(
    @Param('id') id: string,
    @Body() dto: CreateVariantDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.servicesService.addVariant(id, dto, user);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Put('variants/:variantId')
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.servicesService.updateVariant(variantId, dto, user);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Delete('variants/:variantId')
  async deleteVariant(
    @Param('variantId') variantId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.servicesService.deleteVariant(variantId, user);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER')
  @Post(':id/branch-price')
  async setBranchPrice(
    @Param('id') id: string,
    @Body() dto: SetBranchPriceDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.servicesService.setBranchPrice(id, dto, user);
  }
}
