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
import { CustomersService } from './customers.service.js';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  AddCustomerNoteDto,
} from './dto/customer.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.customersService.findAll(user, {
      branchId,
      search,
      status,
      page,
      limit,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.customersService.findOne(id, user);
  }

  @Post()
  async create(
    @Body() dto: CreateCustomerDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.customersService.create(dto, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.customersService.update(id, dto, user);
  }

  @Post(':id/notes')
  async addNote(
    @Param('id') id: string,
    @Body() dto: AddCustomerNoteDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.customersService.addNote(id, dto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.customersService.remove(id, user);
  }
}
