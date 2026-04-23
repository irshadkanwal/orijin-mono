import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupportServiceActivityBeneficiaryDtoCsvAbstract {
  @IsNotEmpty()
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  serviceActivityCode: string;

  @IsNotEmpty()
  beneficiaryCode: string;
}
export class CreateSupportServiceActivityBeneficiaryDtoCsv extends CreateSupportServiceActivityBeneficiaryDtoCsvAbstract {
  primary?: string;
  itemValue?: string;
  itemsProcessed?: string;
  grade?: string;
  score?: string;
  total?: string;
}

export class CreateSupportServiceActivityBeneficiaryDtoCsvConverted {
  primary?: boolean;

  itemValue?: number;
  itemsProcessed?: number;
  grade?: number;
  score?: number;
  total?: number;
}
