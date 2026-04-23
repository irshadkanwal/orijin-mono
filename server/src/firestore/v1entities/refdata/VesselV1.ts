import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { Exclude, Transform, Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import AmountUnit from '../utis/AmountUnit';
import { formatDatesForFS } from '../../v1utils/utils';
import { expandFromId } from '../../v1utils/ormAnnotations';
import ProdLot from '../production/ProdLot';

export enum VesselSubType {
  StorageContainer = 'StorageContainer',
  ExportBag = 'ExportBag',
  CollectionContainer = 'CollectionContainer',
}

export enum VesselType {
  CollectionBin = 'CollectionBin',
  FermentationBin = 'FermentationBin',
  AerationRack = 'AerationRack',
  CacaoTree = 'CacaoTree',
  FreeAirHeap = 'FreeAirHeap',
  CacaoFermentationModule = 'CacaoFermentationModule',
  Refiner = 'Refiner',
  Marquee = 'Marquee',
  ProductSack = 'ProductSack',
}

export default class VesselV1 extends AbstractEntity {
  vesselType: VesselType = null;
  vesselSubType?: VesselSubType = null;
  name: string = null;
  permanent = false;
  picture?: string = null;
  size?: AmountUnit = null;
  weight?: AmountUnit = null;

  @Type(() => ObjectId)
  currentBatch?: ObjectId = null;

  // @Exclude()
  // @expandFromId('currentBatch')
  // currentBatchFull?: Batch = null;

  @Type(() => ObjectId)
  currentProdLot?: ObjectId = null;

  @Transform(({ value }) => formatDatesForFS(value))
  currentProdLotStartDate: Date;

  @Exclude()
  @expandFromId('currentProdLot')
  currentProdLotFull?: ProdLot = null;

  @Type(() => ObjectId)
  facility: ObjectId = null;

  @Type(() => ObjectId)
  plot: ObjectId = null;

  cleanCurrentBatch() {
    this.currentBatch = null;
  }

  hasCurrentBatch() {
    return this.currentBatch != null;
  }

  getCollection(): string {
    return collectionKeys.vessels;
  }
}
