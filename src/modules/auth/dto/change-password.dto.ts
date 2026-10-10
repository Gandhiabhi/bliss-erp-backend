import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsOptional()
  refreshToken?: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword!: string;
}
