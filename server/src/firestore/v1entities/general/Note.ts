import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { AbstractEntity } from '../utis/AbstractEntity';

export default class Note extends AbstractEntity {
  status: string = null;
  content: string = null;
  getCollection(): string {
    return collectionKeys.notes;
  }
}
