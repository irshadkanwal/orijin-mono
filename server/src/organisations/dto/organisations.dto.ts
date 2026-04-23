import { IsNotEmpty } from 'class-validator';
import { FirebaseMetaData } from '../../common/models/firebase-metadata.model';

export class OrganisationValues {
  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;
}

export class OrganisationsDto {
  meta: FirebaseMetaData;
  values: OrganisationValues;
}
