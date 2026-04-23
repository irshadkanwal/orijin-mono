import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export class PendingTaskV1 extends AbstractEntity {
  roles?: string[];
  workflowName: string;
  isNewWorkFlow: boolean;
  canBeRevived: boolean;
  permanentlyDisabled: boolean;
  hideTillEnabled: boolean;
  taskLabelKey?: string;
  taskSubLabel?: string;
  taskSubLabel2?: string;
  sorting?: { column: string; direction: 'asc' | 'desc' };
  displayColour?: string;
  stateFunction: string;
  permanentStateFunction: string;
  activityName: string;
  completedActivityName: string;
  apptype: string;
  loadForOffline: boolean;
  loadForOfflineExtraCollections: string[];
  // offlineLoadDefinitions?: IRemoteSearchDbOptions[];
  loadForOfflineUserRoles: string[];

  @Type(() => ObjectId)
  workflowScopeId: ObjectId;

  @Type(() => ObjectId)
  relatedObjectId: ObjectId;

  @Type(() => ObjectId)
  relatedObjectIdSecondary: ObjectId;

  getCollection(): string {
    return collectionKeys.pendingtasks;
  }

  printDetails(): string {
    return (
      'workflowName:' +
      this.workflowName +
      ';' +
      'isNewWorkFlow:' +
      !!this.isNewWorkFlow +
      ';' +
      'activityName:' +
      this.activityName +
      ';' +
      'enabled:' +
      !!this.enabled +
      ';'
    );
  }
}
