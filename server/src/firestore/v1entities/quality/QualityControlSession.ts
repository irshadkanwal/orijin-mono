import { Exclude, Transform, Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { formatDatesForFS } from '../../v1utils/utils';
import AbstractLot from '../production/AbstractLot';
import { ModificationStatus, SamplePreparationStatus } from '../utis/types';
import { cascadingDelete, expandFromId } from '../../v1utils/ormAnnotations';
import QualityControlResults from './QualityControlResults';
import Analysis from './Analysis';

export default class QualityControlSession extends AbstractLot {
  name: string = null;
  state: string = null;
  description: string = null;
  tags: Array<string> = [];
  type: string = null;

  @Transform(({ value }) => formatDatesForFS(value))
  scheduledDate: Date = null;

  samplePreparationStatus: SamplePreparationStatus =
    SamplePreparationStatus.NotDone;
  modificationStatus: ModificationStatus = ModificationStatus.NotSet;

  params: any = null;

  sheetId: string = null;

  @Type(() => ObjectId)
  referenceObjectId: ObjectId = null;

  @Exclude()
  @expandFromId('referenceObjectId')
  referenceObjectIdFull: any = null;

  @Type(() => ObjectId)
  locationFacilityId: ObjectId = null;

  @Type(() => ObjectId)
  results: ObjectId[] = [];

  @Exclude()
  @expandFromId('results')
  resultsFull: QualityControlResults[] = [];

  @Type(() => ObjectId)
  @cascadingDelete()
  analyses: ObjectId[] = [];

  @Exclude()
  @expandFromId('analyses')
  analysesFull: Array<Analysis> = <Array<Analysis>>[];

  getCollection(): string {
    return collectionKeys.qualitycontrolsessions;
  }
}
