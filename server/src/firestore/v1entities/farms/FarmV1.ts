import { Exclude, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import FacilityV1 from '../refdata/FacilityV1';
import { expandFromId } from '../../v1utils/ormAnnotations';
import { WalletV1 } from '../payments/WalletV1';
import { RegistrationStatus } from '../utis/types';

export enum CertificationStatus {
  Multi = 'Certified',
  New = 'New',
  NotCertified = 'NotCertified',
  InTransition = 'InTransition',
  NotSet = 'NotSet',
  NeverCertified = 'NeverCertified',
  Expelled = 'Expelled',
  Suspended = 'Suspended',
  Sanctioned = 'Sanctioned',
}

export default class FarmV1 extends FacilityV1 {
  name: string = null;
  nickName: string = null;

  certificationStatus: CertificationStatus = CertificationStatus.NotSet;
  isOrganic: boolean = null;

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

  @Type(() => ObjectId)
  mobilePayWallets: Array<ObjectId>;

  @Exclude()
  @expandFromId('mobilePayWallets')
  mobilePayWalletsFull: Array<WalletV1>;

  mobilePayWalletsFullIds: Array<string> = [];

  mobilePayRegistrationStatus: RegistrationStatus = RegistrationStatus.NotSet;

  getCollection(): string {
    return collectionKeys.farms;
  }
}
