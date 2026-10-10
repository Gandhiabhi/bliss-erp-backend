import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import {
  CreatePaymentDto,
  RefundPaymentDto,
  CreateInvoiceDto,
} from './dto/payment.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Payments endpoints
  @Get('payments')
  async findAllPayments(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string,
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
    @Query('method') method?: string,
    @Query('date') date?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.paymentsService.findAllPayments(user, {
      branchId,
      customerId,
      status,
      method,
      date,
      search,
      page,
      limit,
    });
  }

  @Get('payments/:id')
  async findOnePayment(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.paymentsService.findOnePayment(id, user);
  }

  @Post('payments')
  async createPayment(
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.paymentsService.createPayment(dto, user);
  }

  @Post('payments/:id/refund')
  async refundPayment(
    @Param('id') id: string,
    @Body() dto: RefundPaymentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.paymentsService.refundPayment(id, dto, user);
  }

  // Invoices endpoints
  @Get('invoices')
  async findAllInvoices(
    @CurrentUser() user: AuthenticatedUser,
    @Query('branchId') branchId?: string,
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.paymentsService.findAllInvoices(user, {
      branchId,
      customerId,
      status,
      search,
      page,
      limit,
    });
  }

  @Get('invoices/:id')
  async findOneInvoice(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.paymentsService.findOneInvoice(id, user);
  }

  @Post('invoices')
  async createInvoice(
    @Body() dto: CreateInvoiceDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.paymentsService.createInvoice(dto, user);
  }
}
