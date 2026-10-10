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
import { AppointmentsService } from './appointments.service.js';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string,
    @Query('customerId') customerId?: string,
    @Query('staffId') staffId?: string,
    @Query('date') date?: string,
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    return this.appointmentsService.findAll(user, {
      branchId,
      customerId,
      staffId,
      date,
      status,
      search,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.appointmentsService.findOne(id, user);
  }

  @Post()
  async create(
    @Body() dto: CreateAppointmentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.appointmentsService.create(dto, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.appointmentsService.update(id, dto, user);
  }

  @Delete(':id')
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.appointmentsService.remove(id, user);
  }
}
