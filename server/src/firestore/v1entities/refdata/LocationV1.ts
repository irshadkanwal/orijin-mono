import { Exclude, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import Coordinates from '../utis/Coordinates';
import { expandFromId } from '../../v1utils/ormAnnotations';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export enum LocationType {
  Country = 'Country',
  Region = 'Region',
  Parish = 'Parish',
  Zone = 'Zone',
  Village = 'Village',
  Municipality = 'Municipality',
  District = 'District',
}

export default class LocationV1 extends AbstractEntity {
  name: string = null;

  @Type(() => Coordinates)
  coordinates: Coordinates = null;

  type: LocationType = null;

  @Type(() => ObjectId)
  parentFacility: ObjectId = null;

  @Type(() => ObjectId)
  parentFacilityParent: ObjectId = null;

  @Type(() => ObjectId)
  parentFacilityParentParent: ObjectId = null;

  @Type(() => ObjectId)
  parentLocation: ObjectId = null;

  @Type(() => ObjectId)
  parentLocationParent: ObjectId = null;

  @Type(() => ObjectId)
  parentLocationParentParent: ObjectId = null;

  @Exclude()
  @expandFromId('parentLocation')
  parentLocationFull: LocationV1 = null;

  getCollection(): string {
    return collectionKeys.locations;
  }
}
