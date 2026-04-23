import { IsNotEmpty } from 'class-validator';
import { FirebaseMetaData } from '../../common/models/firebase-metadata.model';
// import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AbstracDto {
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;

  description?: string | null;
}

export class CreateServiceCategoryTypeValuesCSV extends AbstracDto {}

export class CreateServiceCategoryTypeValues extends AbstracDto {}
