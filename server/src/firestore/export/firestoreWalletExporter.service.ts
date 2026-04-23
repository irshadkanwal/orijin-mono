import { Injectable, Logger } from '@nestjs/common';
import { AbstractExporter } from './AbstractExporter';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from '../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';
import { WalletV1 } from '../v1entities/payments/WalletV1';
import { Wallet } from '../../persons/models/persons.model';
import { WalletsService } from '../../persons/wallets.service';

@Injectable()
export class FirestoreWalletExporterService extends AbstractExporter<
  Wallet,
  WalletV1,
  WalletsService
> {
  private logger = new Logger(FirestoreWalletExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: WalletsService,
  ) {
    super(firestoreService, myService);
  }

  async transform(input: Wallet, meta: Meta): Promise<WalletV1> {
    const res = new WalletV1();
    setupIdFields(res, input, meta);
    res.id.labelShort = input.phone;
    res.id.label = input.phone;

    res.type = 'MobilePay';
    res.firstName = input.externalFirstName;
    res.name_matches_network_score = input.name_matches_network_score
      ? input.name_matches_network_score.toNumber()
      : null;
    res.name_matches_network_status = input.name_matches_network_status;
    res.name_on_network = input.name_on_network;
    res.errorStatus = input.errorStatus;
    res.errorMsg = input.errorMsg;
    res.firstName = input.externalLastName;
    res.externalId = input.externalId;
    res.phone = input.phone;

    // usingFarms: Array<ObjectId>;
    // usingFarmsFull: Array<WalletV1>;
    // usingFarmsFullIds: Array<string> = [];

    return res;
  }

  async exportAll(meta: Meta, key?: string): Promise<WalletV1[]> {
    meta.onlyCreate = true;
    return super.exportAll(meta, key);
  }
}
