import { Exclude, Transform, Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { formatDatesForFS } from '../../v1utils/utils';
import { expandFromId } from '../../v1utils/ormAnnotations';
import { AbstractEntity } from '../utis/AbstractEntity';
import { HasProcessingProperties, LotState } from '../utis/types';
import ProcessingProperties from '../production/ProcessingProperties';

// A QC is a collection of results for a certain lot for a specific cupping/tasting event.
// It has an average final score which is calculated from the results.A lot can have multiple QCs,
// if it has been cupped/tasted multiple times.A sensorial session has one QC per lot.
export default class Analysis
  extends AbstractEntity
  implements HasProcessingProperties
{
  activityName: string;
  endState?: string;
  systemState: LotState = null;

  @Type(() => ProcessingProperties)
  processingProperties: ProcessingProperties = new ProcessingProperties();

  @Type(() => ObjectId)
  referenceObjectId: ObjectId = null;

  @Type(() => ObjectId)
  qualityControlSessionId: ObjectId = null;

  @Exclude()
  @expandFromId('referenceObjectId')
  referenceObjectFull: AbstractEntity = null;

  @Transform(({ value }) => formatDatesForFS(value))
  startDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  endDate: Date = null;

  @Type(() => ObjectId)
  referenceObjectIds: ObjectId[] = null;

  getCollection(): string {
    return collectionKeys.analyses;
  }
}
