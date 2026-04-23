import { IsNotEmpty } from 'class-validator';
import { AbstractDto, AbstractImportCsvDto } from '../../common/dto/types';

export abstract class AbstractCertificationType
  implements AbstractDto, AbstractImportCsvDto
{
  organisation: string;
  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;
}

export class CertificationTypeDto extends AbstractCertificationType {}

export class CertificationTypeDtoCsv extends AbstractCertificationType {}

export class CertificationsDto implements AbstractDto {
  organisation: string;

  certificationTypeId: string;
  certificationTypeCode: string;

  @IsNotEmpty()
  status: string;
  startsAt: Date;
  endsAt?: Date;

  farmId: string;
  farmCode: string;
}
