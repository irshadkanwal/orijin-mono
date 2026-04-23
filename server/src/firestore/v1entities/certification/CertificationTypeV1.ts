import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { AbstractEntity } from '../utis/AbstractEntity';

export default class CertificationTypeV1 extends AbstractEntity {
  name: string = null;

  getCollection(): string {
    return collectionKeys.certificationtypes;
  }
}
