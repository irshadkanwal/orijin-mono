import { Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import ProcessingProperties from '../production/ProcessingProperties';

export default class ActivityLog extends AbstractEntity {
  @Type(() => ObjectId)
  parentId: ObjectId;

  @Type(() => ObjectId)
  workflowScopeId: ObjectId;

  @Type(() => ObjectId)
  auditActivityId: ObjectId;

  @Type(() => ObjectId)
  parentSecondaryItems: ObjectId[];

  allParentItemsSearchable: string[];

  primaryActivityName: string;

  primaryActivityLabel: string;

  workflowName: string;
  activityName: string;

  activityLabel: string;

  method: string;

  type: string;

  properties: any = null;

  previewValues: { key: string; value: string }[];

  oldProperties: ProcessingProperties = new ProcessingProperties();



  getCollection(): string {
    return collectionKeys.activitylogs;
  }
}
