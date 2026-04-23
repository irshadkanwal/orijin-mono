import { Exclude, Transform, Type } from 'class-transformer';
import { formatDatesForFS } from '../../v1utils/utils';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import TrainingV1 from './TrainingV1';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
export default class TrainingSessionV1 extends AbstractEntity {
  name: string = null;
  type: string = null;
  status: string = null;
  notes: string = null;

  @Transform(({ value }) => formatDatesForFS(value))
  startDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  endDate: Date = null;

  @Type(() => ObjectId)
  trainingType: ObjectId = null;

  @Type(() => ObjectId)
  location: ObjectId = null;

  @Type(() => ObjectId)
  locationParent: ObjectId = null;

  @Exclude()
  attendance: Array<TrainingV1>;

  getCollection(): string {
    return collectionKeys.trainingsessions;
  }
}
