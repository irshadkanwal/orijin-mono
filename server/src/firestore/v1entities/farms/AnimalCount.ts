import { Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export default class AnimalCount extends AbstractEntity {
  type: string = null;
  count: number = null;
  isOrganic: boolean = null;
  usedForManure: boolean = null;

  description: string = null;
  notes: string = null;

  @Type(() => ObjectId)
  entity: ObjectId = null;

  getCollection(): string {
    return collectionKeys.animalcounts;
  }
}
