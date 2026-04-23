import { Exclude, Transform, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { expandFromId } from '../../v1utils/ormAnnotations';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { formatDatesForFS } from '../../v1utils/utils';
import { ObjectIdUser, PaymentStatus, PaymentType } from '../utis/types';
import AmountUnit from '../utis/AmountUnit';

export class PaymentTransactionV1 extends AbstractEntity {
  type: PaymentType = PaymentType.NotSet;
  externalId: string = null;
  status: PaymentStatus = PaymentStatus.NotSet;

  localAccountId: string = null;
  localFirstName: string = null;
  localLastName: string = null;

  targetAccountId: string = null;
  targetFirstName: string = null;
  targetLastName: string = null;

  amount: number = null;
  currency: string = null;
  paymentType: string = null;
  productQuantity: AmountUnit = null;

  errorMsg: string = null;
  errorStatus: string = null;
  resolutionComment: string = null;

  externalAccount: string = null;
  externalPaymentType: string = null;
  externalState: string = null;

  feeCharged: number = null;
  remote_transaction_id: string = null;

  requestPaylod: any;
  responsePaylod: any;
  webhookRequest: any;

  retryCounter = 0;

  @Transform(({ value }) => formatDatesForFS(value))
  transactionCreatedDate: Date;

  @Type(() => ObjectIdUser)
  transactionCreatedBy: ObjectIdUser;

  @Type(() => ObjectId)
  productionEntity: ObjectId = null;

  @Type(() => ObjectId)
  productionEntityParent: ObjectId = null;

  @Type(() => ObjectId)
  producerEntity: ObjectId = null;

  producerName: string = null;

  @Type(() => ObjectId)
  targetWallet: ObjectId = null;

  @Exclude()
  @expandFromId('producerEntity')
  producerEntityFull: ObjectId = null;

  getCollection(): string {
    return collectionKeys.paymenttransactions;
  }
}
