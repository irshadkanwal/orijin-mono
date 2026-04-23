import { Exclude, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import PriceContainer from '../utis/PriceContainer';
import VarietyPriceV1 from './VarietyPriceV1';
import { expandFromId } from '../../v1utils/ormAnnotations';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export enum ProductType {
  Cacao = 'Cacao',
  Coffee = 'Coffee',
}

export default class ProductV1 extends AbstractEntity {
  name: string = null;
  sku: string = null;

  organic = false;
  dry = false;

  singleOrigin = false;

  @Type(() => ObjectId)
  originFacility: ObjectId = null;

  @Type(() => ObjectId)
  originLocation: ObjectId = null;

  @Type(() => ObjectId)
  originProducer: ObjectId = null;

  @Type(() => ObjectId)
  crop: ObjectId = null;

  @Type(() => ObjectId)
  variety: ObjectId = null;

  @Type(() => ObjectId)
  varietyPrice: ObjectId = null;

  @Type(() => PriceContainer)
  price: PriceContainer = null;

  @Exclude()
  @expandFromId('varietyPrice')
  varietyPriceFull: VarietyPriceV1 = null;

  @Type(() => ObjectId)
  defaultPackagingContainer: ObjectId = null;

  packagingContainers: Array<ObjectId> = <Array<ObjectId>>[];

  type: ProductType = null;

  getCollection(): string {
    return collectionKeys.products;
  }
}
