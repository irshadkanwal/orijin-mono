import { Exclude, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { expandFromId } from '../../v1utils/ormAnnotations';
import { ObjectId } from '../utis/ObjectId';
import AbstractLot from './AbstractLot';
import OriginProperties from './OriginProperties';
import AmountUnit from '../utis/AmountUnit';
import {
  ACType,
  HasNotes,
  HasProcessingProperties,
  PaymentSummary,
  PaymentType,
  SeasonHistoryItem,
} from '../utis/types';
import SourceRelationshipWeightArrayObject from '../utis/SourceRelationshipWeightArrayObject';

export default class LotSection
  extends AbstractLot
  implements HasProcessingProperties, HasNotes
{
  @Type(() => SourceRelationshipWeightArrayObject)
  source: SourceRelationshipWeightArrayObject;

  @Type(() => ObjectId)
  originPropertiesId: ObjectId;

  @expandFromId('originPropertiesId')
  @Exclude()
  originProperties: OriginProperties;

  @Type(() => ObjectId)
  parentId: ObjectId;

  activityName: string = null;
  endState: string = null;

  aCType: ACType;
  activityType: string = null;

  @Type(() => SeasonHistoryItem)
  seasonHistory: Array<SeasonHistoryItem>;

  @Type(() => ObjectId)
  producer: ObjectId;

  @Type(() => PaymentSummary)
  payment: PaymentSummary;

  @Type(() => ObjectId)
  paymentTransaction: ObjectId;

  paymentType: PaymentType = PaymentType.NotSet;

  paymentAmount: AmountUnit;

  paymentWeight: number;

  @Type(() => ObjectId)
  targetWallet: ObjectId;


  getCollection(): string {
    return collectionKeys.lotsections;
  }
}
