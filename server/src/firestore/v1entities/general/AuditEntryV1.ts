import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { Exclude, Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { expandFromId } from '../../v1utils/ormAnnotations';
import { HasProcessingProperties, LotState } from '../utis/types';
import ProcessingProperties from '../production/ProcessingProperties';

export default class AuditEntryV1
  extends AbstractEntity
  implements HasProcessingProperties
{
  activityName: string;
  activityType: string;
  endState?: string;
  systemState?: LotState = null;

  @Type(() => ProcessingProperties)
  processingProperties: ProcessingProperties = new ProcessingProperties();

  @Type(() => ObjectId)
  referenceObjectId: ObjectId = null;

  @Exclude()
  @expandFromId('referenceObjectId')
  referenceObjectFull: AbstractEntity = null;

  @Type(() => ObjectId)
  previousVersionObjectId: ObjectId = null;

  @Exclude()
  @expandFromId('previousVersionObjectId')
  previousVersionObjectFull: AbstractEntity = null;

  @Type(() => ObjectId)
  referenceObjectIds: ObjectId[] = null;

  @Type(() => ObjectId)
  parentAuditActivity: ObjectId = null;

  getCollection(): string {
    return collectionKeys.auditentries;
  }
}
