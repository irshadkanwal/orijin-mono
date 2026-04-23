import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { Transform, Type } from 'class-transformer';
import { formatDatesForFS } from '../../v1utils/utils';

export default class InspectionRecord extends AbstractEntity {
  name: string = null;
  type: string = null;

  contractPhoto: string = null;

  signatureUs: string = null;
  signatureThem: string = null;
  signatureNameUs: string = null;
  signatureNameThem: string = null;

  @Transform(({ value }) => formatDatesForFS(value))
  signatureDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  datePlanned: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  actualDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  lastInspectionDate: Date = null;

  @Type(() => ObjectId)
  inspector: ObjectId = null;

  @Type(() => ObjectId)
  entity: ObjectId = null;

  getCollection(): string {
    return collectionKeys.inspectionrecords;
  }
}
