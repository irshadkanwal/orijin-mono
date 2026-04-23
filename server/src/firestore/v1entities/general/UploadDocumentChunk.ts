import { Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export default class UploadDocumentChunk extends AbstractEntity {
  index: number;
  data: string;
  size: number;

  @Type(() => ObjectId)
  entity: ObjectId;

  getCollection(): string {
    return collectionKeys.documentchunks;
  }
}
