import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PlanServiceItemDto {
  @IsString()
  @IsNotEmpty()
  serviceId!: string;

  @IsString()
  @IsOptional()
  serviceVariantId?: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  branchId?: string; // null = global

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  durationDays!: number;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanServiceItemDto)
  services!: PlanServiceItemDto[];
}

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  durationDays?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanServiceItemDto)
  @IsOptional()
  services?: PlanServiceItemDto[];
}
