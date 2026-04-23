import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FirebaseMetaData } from '../../common/models/firebase-metadata.model';
// import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class UpdateSupportServiceCategoryDto {
  @IsString()
  @IsOptional()
  organisation: string;

  @IsString()
  @IsOptional()
  service: string; // In reality "ServiceCategoryType"

  @IsString()
  @IsOptional()
  type: string; // Could be an enum

  @IsString()
  @IsOptional()
  shortCode: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;
}
