import { Transform, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { formatDatesForFS } from '../../v1utils/utils';

export default class NonComplianceV1 extends AbstractEntity {
  type: string = null;
  description: string = null;
  status: string = null;
  severity: string = null;

  correctiveActionType: string = null;
  correctiveActionDescription: string = null;
  correctiveActionResponsiblePerson: string = null;

  notes: string = null;

  @Transform(({ value }) => formatDatesForFS(value))
  correctiveActionDeadlineDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  followUpDate: Date = null;

  @Type(() => ObjectId)
  entity: ObjectId = null;

  getCollection(): string {
    return collectionKeys.noncompliances;
  }
}
