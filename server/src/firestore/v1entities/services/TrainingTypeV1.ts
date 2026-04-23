import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { AbstractEntity } from '../utis/AbstractEntity';

export default class TrainingTypeV1 extends AbstractEntity {
  name: string = null;
  type: string = null;

  getCollection(): string {
    return collectionKeys.trainingtypes;
  }
}
