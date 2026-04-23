import { Exclude, Type } from 'class-transformer';
import { LocationSearchHolder } from '../../v1utils/utils';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import Coordinates from '../utis/Coordinates';
import { expandFromId } from '../../v1utils/ormAnnotations';
import Address from './Address';
import GeoDataV1 from './GeoDataV1';
import LocationV1 from './LocationV1';
import UserV1 from '../org/UserV1';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export enum FacilityType {
  Farm = 'Farm',
  ProductionFacility = 'ProductionFacility',
  RoastingFacility = 'RoastingFacility',
  CollectionFacility = 'CollectionFacility',
  ProcessingFacility = 'ProcessingFacility',
  FermentationFacility = 'FermentationFacility',
  Organisation = 'Organisation',
  FarmerGroup = 'FarmerGroup',
  Community = 'Community',
}

export default class FacilityV1
  extends AbstractEntity
  implements LocationSearchHolder
{
  name: string = null;

  type: FacilityType = null;

  @Type(() => ObjectId)
  parentFacility: ObjectId = null;

  @Type(() => ObjectId)
  parentFacilityParent: ObjectId = null;

  @Type(() => ObjectId)
  parentFacilityParentParent: ObjectId = null;

  @Exclude()
  @expandFromId('parentFacility')
  parentFacilityFull: FacilityV1 = null;

  @Type(() => ObjectId)
  parentLocation: ObjectId = null;

  parentLocationCode: string = null;
  parentLocationName: string = null;

  @Type(() => ObjectId)
  parentLocationParent: ObjectId = null;
  parentLocationParentCode: string = null;
  parentLocationParentName: string = null;

  @Type(() => ObjectId)
  parentLocationParentParent: ObjectId = null;
  parentLocationParentParentCode: string = null;
  parentLocationParentParentName: string = null;

  @Type(() => ObjectId)
  parentLocationParentParentParent: ObjectId = null;
  parentLocationParentParentParentCode: string = null;
  parentLocationParentParentParentName: string = null;

  @Exclude()
  @expandFromId('parentLocation')
  parentLocationFull: LocationV1 = null;

  @Type(() => ObjectId)
  persons: Array<ObjectId>;

  @Type(() => ObjectId)
  mainContactPerson: ObjectId;

  @Exclude()
  @expandFromId('mainContactPerson')
  mainContactPersonFull: UserV1 = null;

  @Type(() => Coordinates)
  location: Coordinates = null;

  @Type(() => Address)
  address: Address = null;

  @Type(() => ObjectId)
  geodatas: Array<ObjectId>;

  @Exclude()
  @expandFromId('geodatas')
  geodatasFull: Array<GeoDataV1>;

  @Type(() => ObjectId)
  polygon: ObjectId = null;

  @Exclude()
  @expandFromId('polygon')
  polygonFull: GeoDataV1 = null;

  areaTotal: number;
  areaTotalManual: number;
  timezone: string;

  getCollection(): string {
    return collectionKeys.facilities;
  }
}
