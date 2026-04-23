import { FunctionTypes } from '@prisma/client';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreateRuleDto {
  @IsString()
  readonly category: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly functionCode: string;

  @IsEnum(FunctionTypes, { message: 'functionType must be a valid enum value' })
  readonly functionType: FunctionTypes;

  @IsNumber()
  readonly commonThreshold: number;

  @IsOptional()
  @IsString()
  readonly countryAdjustments?: string;
}

export class UpdateRuleDto {
  @IsOptional()
  @IsString()
  readonly category?: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly functionCode?: string;

  @IsOptional()
  @IsNumber()
  readonly commonThreshold?: number;

  @IsOptional()
  @IsString()
  readonly countryAdjustments?: string;
}
