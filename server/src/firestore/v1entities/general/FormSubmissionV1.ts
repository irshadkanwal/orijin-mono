import { Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { FormSubmissionType } from '../utis/types';

export default class FormSubmissionV1 extends AbstractEntity {
  activityName: string = null;
  workflowName: string = null;
  configKey: string = null;
  triggerPendingTaskId: string;
  stepId: string;
  previewValues: any;
  formValues: any;
  error: any;
  submissionType: FormSubmissionType = FormSubmissionType.NotSet;
  status: string;

  @Type(() => ObjectId)
  workflowScopeId: ObjectId = null;

  @Type(() => ObjectId)
  entityId: ObjectId = null;

  getCollection(): string {
    return collectionKeys.formsubmissions;
  }
}
