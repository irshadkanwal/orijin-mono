import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateSupportServiceActivityDto {
  @IsString()
  @IsOptional()
  operator?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  farmerGroupIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  personIds: string[];

  @IsDateString()
  @IsOptional()
  dateOfService?: Date;

  @IsString()
  @IsOptional()
  supportingServiceCategoryId?: string;

  @IsString()
  @IsOptional()
  locationId?: string;

  @IsString()
  @IsOptional()
  organisation?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  userType?: string;

  @IsString()
  @IsOptional()
  supportingServiceCategoryTypeId?: string;
}
