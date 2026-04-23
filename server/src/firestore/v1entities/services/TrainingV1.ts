import { Transform, Type } from 'class-transformer';
import { formatDatesForFS } from '../../v1utils/utils';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
export default class TrainingV1 extends AbstractEntity {
  name: string = null;
  type: string = null;
  status: string = null;
  notes: string = null;

  @Transform(({ value }) => formatDatesForFS(value))
  startDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  endDate: Date = null;

  @Type(() => ObjectId)
  entity: ObjectId = null;

  @Type(() => ObjectId)
  trainingType: ObjectId = null;

  @Type(() => ObjectId)
  trainingSession: ObjectId = null;

  getCollection(): string {
    return collectionKeys.trainings;
  }
}
