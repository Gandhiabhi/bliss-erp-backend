import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VisitStatus } from '@prisma/client';

export class RedeemServiceItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Service ID is required' })
  serviceId!: string;

  @IsString()
  @IsOptional()
  serviceVariantId?: string;

  @IsString()
  @IsOptional()
  membershipServiceId?: string; // If redeeming from membership entitlement

  @IsString()
  @IsOptional()
  staffId?: string; // Therapist performing service

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateVisitDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId!: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  membershipId?: string;

  @IsDateString()
  @IsOptional()
  visitDate?: string;

  @IsDateString()
  @IsOptional()
  checkInTime?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RedeemServiceItemDto)
  @IsNotEmpty()
  services!: RedeemServiceItemDto[];
}

export class UpdateVisitStatusDto {
  @IsEnum(VisitStatus)
  @IsNotEmpty()
  status!: VisitStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
