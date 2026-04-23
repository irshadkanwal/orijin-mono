import { Exclude, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { cascadingDelete, expandFromId } from '../../v1utils/ormAnnotations';
import UploadDocumentChunk from './UploadDocumentChunk';
import { FileDocument } from '../utis/types';

export default class UploadDocument extends AbstractEntity {
  name: string;
  type: string;
  source: string;
  category?: string;
  mimeType?: string;
  url: string;
  originalUploadName?: string;
  storagePath?: string;
  publicUrl?: string;
  language?: string;
  lastModified?: Date;
  isLocked?: boolean;
  targetProperty?: string;
  sourceProperty?: string;
  uid?: string;
  index?: number;

  size?: number;
  data?: string;
  isSliced?: boolean;
  error?: string;

  @Type(() => ObjectId)
  entity: ObjectId;

  @Type(() => ObjectId)
  @cascadingDelete()
  chunks: Array<ObjectId>;

  @Exclude()
  @expandFromId('chunks')
  chunksFull: Array<UploadDocumentChunk>;

  getCollection(): string {
    return collectionKeys.documents;
  }

  getFileDocument(): FileDocument {
    return {
      name: this.name,
      type: this.type,
      url: this.url,
      storagePath: this.storagePath,
      publicUrl: this.publicUrl,
      language: this.language,
      lastModified: this.lastModified,
      isLocked: this.isLocked,
      size: this.size,
      id: this.id,
    };
  }
}
