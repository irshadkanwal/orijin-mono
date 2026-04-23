import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { AbstractEntity } from '../utis/AbstractEntity';
import { ObjectId } from '../utis/ObjectId';
import CropV1 from './CropV1';
import { expandFromId } from '../../v1utils/ormAnnotations';
import { Exclude, Type } from 'class-transformer';

export default class VarietyV1 extends AbstractEntity {
  name: string = null;
  grade: number = null;
  organic = false;
  dry = false;

  @Type(() => ObjectId)
  crop: ObjectId = null;

  @Exclude()
  @expandFromId('mainCrop')
  cropFull: CropV1 = null;

  constructor(name?: string) {
    super();
    this.name = name;
  }

  getCollection(): string {
    return collectionKeys.varieties;
  }
}
