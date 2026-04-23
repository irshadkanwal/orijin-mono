import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { expandOnLoad, mapToObjectId } from '../../v1utils/ormAnnotations';
export default class WorkflowScope extends AbstractEntity {
  workflowFinished = false;
  isAtBeginning = true;
  completedWorkflowStep: string;
  workFlowName: string;
  chainId: string;
  apptype: string;

  @Type(() => ObjectId)
  relatedObjectId: ObjectId;

  @Type(() => ObjectId)
  relatedObjectIdSecondary: ObjectId;

  @Type(() => ObjectId)
  @mapToObjectId(collectionKeys.workflowscopes)
  @expandOnLoad()
  parent: WorkflowScope;

  completedSteps: string[];

  getCollection(): string {
    return collectionKeys.workflowscopes;
  }
}
