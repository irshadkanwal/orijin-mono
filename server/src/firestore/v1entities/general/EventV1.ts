import { Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { collectionKeys } from '../../v1utils/dbMappingUtils';

export default class EventV1 extends AbstractEntity {
  name: string;
  configKey: string;
  referenceObjectType: string;
  triggerPendingTaskId: string;
  stepId: string;
  value: any;
  previousValue: any;

  @Type(() => ObjectId)
  referenceObjectId: ObjectId = null;

  @Type(() => ObjectId)
  workflowScopeId: ObjectId;

  getCollection(): string {
    return collectionKeys.events;
  }
}
