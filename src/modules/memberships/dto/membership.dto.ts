import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MembershipStatus, PaymentMethod } from '@prisma/client';

export class MembershipServiceAllocationDto {
  @IsString()
  @IsNotEmpty()
  serviceId!: string;

  @IsString()
  @IsOptional()
  serviceVariantId?: string;

  @IsNumber()
  @Min(1)
  allocatedQuantity!: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateMembershipDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId!: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  planTemplateId?: string; // If null, this is a custom plan

  @IsBoolean()
  @IsOptional()
  isCustomPlan?: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Membership plan name is required' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsOptional()
  currency?: string;

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
  notes?: string;

  // Custom service allocations (mandatory for custom plan, or snapshot overrides)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MembershipServiceAllocationDto)
  @IsOptional()
  services?: MembershipServiceAllocationDto[];

  // Optional immediate payment processing
  @IsBoolean()
  @IsOptional()
  recordPayment?: boolean;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  transactionReference?: string;
}

export class UpdateMembershipStatusDto {
  @IsEnum(MembershipStatus)
  @IsNotEmpty()
  status!: MembershipStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
