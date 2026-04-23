import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export default class Configuration extends AbstractEntity {
  data: Array<{ key: string; value: any }> = [];

  userId: ObjectId = null;

  getCollection(): string {
    return collectionKeys.configurations;
  }
}
