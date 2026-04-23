import { Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import FacilityV1 from '../refdata/FacilityV1';

export default class Farm_minV1 extends FacilityV1 {
  name: string = null;
  nickName: string = null;

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

  @Type(() => ObjectId)
  parentLocationParentParentParent: ObjectId = null;

  quantityProcessedCurrentSeasonRaw: number;
  quantityProcessedCurrentSeasonProcessed: number;
  maxQuantityProcessedLimitRaw: number;
  maxQuantityProcessedLimitProcessed: number;

  // @Type(() => ObjectId)
  // mobilePayWallets: Array<ObjectId>;
  //
  // @Exclude()
  // @expandFromId('mobilePayWallets')
  // mobilePayWalletsFull: Array<Wallet>;
  //
  // mobilePayWalletsFullIds: Array<string> = [];

  // mobilePayRegistrationStatus: RegistrationStatus = RegistrationStatus.NotSet;

  getCollection(): string {
    return collectionKeys.farms_min;
  }
}
