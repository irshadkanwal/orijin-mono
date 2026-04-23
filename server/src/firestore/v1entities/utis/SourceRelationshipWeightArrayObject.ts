import { Exclude, Type } from 'class-transformer';

import SourceRelationshipWeight from './SourceRelationshipWeight';
import { ObjectId } from './ObjectId';
import ProdLot from '../production/ProdLot';

export default class SourceRelationshipWeightArrayObject {
  @Type(() => ObjectId)
  ref: ObjectId;

  @Exclude()
  refFull: ProdLot;

  @Type(() => SourceRelationshipWeight)
  weight: SourceRelationshipWeight;

  @Exclude()
  weightAvailableExcludingMe?: number;

  @Exclude()
  sackCountAvailableExcludingMe?: number;
}
