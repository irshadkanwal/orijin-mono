import { Transform } from 'class-transformer';
import { formatDatesForFS } from '../../v1utils/utils';
import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { AbstractEntity } from '../utis/AbstractEntity';

export default class SeasonV1 extends AbstractEntity {
  name: string = null;

  @Transform(({ value }) => formatDatesForFS(value))
  startDate: Date;

  @Transform(({ value }) => formatDatesForFS(value))
  endDate: Date;

  getCollection(): string {
    return collectionKeys.seasons;
  }
}
