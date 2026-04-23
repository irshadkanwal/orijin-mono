import { Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export interface GeoDataCoordinate {
  lat: number;
  lng: number;
  timeStamp?: number;
}

export default class GeoDataV1 extends AbstractEntity {
  type: 'Polygon' | 'Point' = null;
  targetType: 'Plot' | 'Farm' = null;
  name: string = null;

  data: GeoDataCoordinate[] = null;
  areaCalculated: number = null;
  areaManual: number = null;
  notes: string = null;

  @Type(() => ObjectId)
  season: ObjectId = null;

  @Type(() => ObjectId)
  entity: ObjectId = null;

  @Type(() => ObjectId)
  entityParent: ObjectId = null;

  getCollection(): string {
    return collectionKeys.geodatas;
  }
}
