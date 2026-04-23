import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { AbstractEntity } from '../utis/AbstractEntity';

export default class CropV1 extends AbstractEntity {
  name: string = null;

  constructor(name?: string) {
    super();
    this.name = name;
  }

  getCollection(): string {
    return collectionKeys.crops;
  }
}
