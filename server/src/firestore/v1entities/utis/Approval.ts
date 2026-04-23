import { Transform } from 'class-transformer';
import { formatDatesForFS } from '../../v1utils/utils';
import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { AbstractEntity } from './AbstractEntity';

export default class Approval extends AbstractEntity {
  note: string;

  @Transform(({ value }) => formatDatesForFS(value))
  approvalDate: Date;

  getCollection(): string {
    return collectionKeys.approvals;
  }
}
