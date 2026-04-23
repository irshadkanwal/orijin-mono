import { FirebaseMetaData } from '../../common/models/firebase-metadata.model';

export class ContractValues {
  shortCode: string;

  status: string;

  startsAt: Date;
  endsAt: Date;

  farmId: string;
  farmCode: string;
}

export class ContractsDto {
  meta: FirebaseMetaData;
  values: ContractValues;
}
