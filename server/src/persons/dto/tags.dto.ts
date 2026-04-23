import { IsNotEmpty } from 'class-validator';
import { FirebaseMetaData } from '../../common/models/firebase-metadata.model';

export class TagValues {
  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  organisation: string;
}

export class TagsDto {
  meta: FirebaseMetaData;
  values: TagValues;
}
