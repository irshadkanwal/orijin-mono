import { Transform } from 'class-transformer';
import { formatDatesForFS } from '../../v1utils/utils';
import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { AbstractEntity } from '../utis/AbstractEntity';

export default class PersonV1 extends AbstractEntity {
  name: string = null;
  relationshipToPrincipal: string = null;

  firstName: string = null;
  middleName: string = null;
  lastName: string = null;
  gender: string = null;

  @Transform(({ value }) => formatDatesForFS(value))
  dob: Date = null;
  dobApproximate: boolean = null;
  identificationNumber: string = null;
  identificationNumberType: string = null;
  education: string = null;
  maritalStatus: string = null;

  getCollection(): string {
    return collectionKeys.persons;
  }
}
