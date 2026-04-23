import { Transform, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { formatDatesForFS } from '../../v1utils/utils';

export default class Contract extends AbstractEntity {
  name: string = null;
  type: string = null;
  status: string = null;
  notes: string = null;

  @Transform(({ value }) => formatDatesForFS(value))
  startDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  endDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  lastInspectionDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  firstVisitDate: Date = null;

  @Type(() => ObjectId)
  entity: ObjectId = null;

  getCollection(): string {
    return collectionKeys.contracts;
  }
}
