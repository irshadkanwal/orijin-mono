import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { AbstractEntity } from '../utis/AbstractEntity';

export default class Tag extends AbstractEntity {
  name: string = null;
  type: string = null;

  enabled = false;

  constructor(name?: string) {
    super();
    this.name = name;
  }

  getCollection(): string {
    return collectionKeys.tags;
  }
}
