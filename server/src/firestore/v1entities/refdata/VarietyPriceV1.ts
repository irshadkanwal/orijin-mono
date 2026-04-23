import { Exclude, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { expandFromId } from '../../v1utils/ormAnnotations';
import VarietyV1 from './VarietyV1';
import PriceContainer from '../utis/PriceContainer';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export default class VarietyPriceV1 extends AbstractEntity {
  name: string = null;

  @Type(() => ObjectId)
  variety: ObjectId = null;

  @Exclude()
  @expandFromId('variety')
  varietyFull: VarietyV1 = null;

  @Type(() => PriceContainer)
  price: PriceContainer = null;

  @Type(() => ObjectId)
  parentFacility: ObjectId = null;

  getCollection(): string {
    return collectionKeys.varietyprices;
  }
}
