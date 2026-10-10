import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer is required' })
  customerId!: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Service is required' })
  serviceId!: string;

  @IsString()
  @IsOptional()
  serviceVariantId?: string;

  @IsString()
  @IsOptional()
  staffId?: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledDate!: string;

  @IsString()
  @IsNotEmpty({ message: 'Start time is required (e.g. 14:00)' })
  startTime!: string;

  @IsString()
  @IsNotEmpty({ message: 'End time is required (e.g. 15:00)' })
  endTime!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsString()
  @IsOptional()
  serviceVariantId?: string;

  @IsString()
  @IsOptional()
  staffId?: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
