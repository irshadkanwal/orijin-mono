import { Transform, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { formatDatesForFS } from '../../v1utils/utils';
export default class CertificationV1 extends AbstractEntity {
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

  @Type(() => ObjectId)
  inspectionsRecords: Array<ObjectId> = <Array<ObjectId>>[];

  @Type(() => ObjectId)
  entity: ObjectId = null;

  @Type(() => ObjectId)
  certificationType: ObjectId = null;

  getCollection(): string {
    return collectionKeys.certifications;
  }
}
