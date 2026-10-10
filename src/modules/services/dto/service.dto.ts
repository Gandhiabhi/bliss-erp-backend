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

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(5)
  duration!: number;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsOptional()
  currency?: string;
}

export class UpdateVariantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(5)
  @IsOptional()
  duration?: number;

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
}

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(5)
  defaultDuration!: number;

  @IsNumber()
  @Min(0)
  defaultPrice!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  @IsOptional()
  variants?: CreateVariantDto[];
}

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(5)
  @IsOptional()
  defaultDuration?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  defaultPrice?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class SetBranchPriceDto {
  @IsString()
  @IsNotEmpty()
  branchId!: string;

  @IsNumber()
  @Min(0)
  customPrice!: number;

  @IsString()
  @IsNotEmpty()
  currency!: string;
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;
}
