import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { Type } from 'class-transformer';

export type SurveyItem = {
  name: string;
  label: string;
  widget?: string;
  valueJsonata?: string;
  value: any;
  section?: string;
  tags?: [];
  index?: number;
};

export default class EntitySurvey extends AbstractEntity {
  activityName: string;
  activityLabel: string;
  tags: string[];
  name: string;
  entityType: string;
  description: string = null;
  notes: string = null;

  @Type(() => ObjectId)
  entity: ObjectId = null;

  @Type(() => ObjectId)
  entityParent: ObjectId = null;

  values: SurveyItem[];

  @Type(() => ObjectId)
  parentAuditActivity: ObjectId = null;

  getCollection(): string {
    return collectionKeys.surveys;
  }
}
