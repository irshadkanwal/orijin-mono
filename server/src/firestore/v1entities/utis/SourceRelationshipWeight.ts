import { Type } from 'class-transformer';
import AmountUnit from './AmountUnit';
import { ObjectId } from './ObjectId';

export default class SourceRelationshipWeight {
  @Type(() => AmountUnit)
  weight: AmountUnit;

  weightKg?: number;
  percentage?: number;
  sackCount?: number;
  containerId?: Array<number> = <Array<number>>[];

  targetBin: ObjectId;
}
