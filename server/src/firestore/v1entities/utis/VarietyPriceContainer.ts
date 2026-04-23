import { Type } from 'class-transformer';
import { ObjectId } from './ObjectId';
import PriceContainer from './PriceContainer';

export default class VarietyPriceContainer {
  @Type(() => PriceContainer)
  price: PriceContainer = null;

  @Type(() => ObjectId)
  variety: ObjectId;
}
