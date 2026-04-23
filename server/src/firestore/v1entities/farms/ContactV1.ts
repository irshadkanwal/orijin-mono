import { Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export class ContactV1 extends AbstractEntity {
  firstName: string = null;
  lastName: string = null;
  phone: string = null;
  registeredUnderPrincipalsName = false;
  registeredForMobileMoney = false;

  @Type(() => ObjectId)
  entity: ObjectId = null;

  @Type(() => ObjectId)
  wallet: ObjectId = null;

  getCollection(): string {
    return collectionKeys.contacts;
  }
}
