import { Transform, Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import QualityControlResultSubmissionItem from './QualityControlResultSubmissionItem';
import { ObjectIdUser } from '../utis/types';
import ProcessingProperties from '../production/ProcessingProperties';
import { formatDatesForFS } from '../../v1utils/utils';

export default class QualityControlResultSubmission extends AbstractEntity {
  @Type(() => ObjectId)
  qualityControlSessionId: ObjectId = null;

  @Type(() => ObjectId)
  qualityControlResultsId: ObjectId = null;

  @Type(() => ObjectId)
  referenceObjectId: ObjectId = null;

  sheetId: string = null;

  @Type(() => QualityControlResultSubmissionItem)
  submissions: QualityControlResultSubmissionItem[] = [];

  score?: number = null;
  notes?: string = null;
  evaluator?: ObjectIdUser = null;

  @Type(() => ProcessingProperties)
  processingProperties: ProcessingProperties = new ProcessingProperties();

  @Transform(({ value }) => formatDatesForFS(value))
  startDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  endDate: Date = null;

  getCollection(): string {
    return collectionKeys.qualitycontrolresultsubmissions;
  }
}
