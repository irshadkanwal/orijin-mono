import { Exclude, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { expandFromId } from '../../v1utils/ormAnnotations';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { RegistrationStatus } from '../utis/types';

export class WalletV1 extends AbstractEntity {
  type: 'MobilePay' = null;
  externalId: string = null;
  status: RegistrationStatus = null;

  firstName: string = null;
  lastName: string = null;
  phone: string = null;

  errorMsg: string = null;
  errorStatus: string = null;
  resolutionComment: string = null;
  name_on_network: string = null;
  name_matches_network_score: number = null;
  name_matches_network_status: string = null;

  @Type(() => ObjectId)
  identityProducer: ObjectId = null;

  @Type(() => ObjectId)
  usingFarms: Array<ObjectId>;

  @Exclude()
  @expandFromId('usingFarms')
  usingFarmsFull: Array<WalletV1>;

  usingFarmsFullIds: Array<string> = [];

  producerVerificationStatus: string;

  getCollection(): string {
    return collectionKeys.wallets;
  }
}
