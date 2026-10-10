import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, PaymentStatus, InvoiceStatus } from '@prisma/client';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId!: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  invoiceId?: string;

  @IsString()
  @IsOptional()
  membershipId?: string;

  @IsNumber()
  @Min(0.01, { message: 'Payment amount must be greater than 0' })
  amount!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsOptional()
  transactionReference?: string;

  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class RefundPaymentDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @IsNotEmpty({ message: 'Reason for refund is required' })
  reason!: string;
}

export class CreateInvoiceItemDto {
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  tax?: number;

  @IsString()
  @IsOptional()
  currency?: string;
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId!: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  membershipId?: string;

  @IsString()
  @IsOptional()
  visitId?: string;

  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  @IsNotEmpty()
  items!: CreateInvoiceItemDto[];
}
