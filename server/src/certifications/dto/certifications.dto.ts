import { AbstractDto, AbstractImportCsvDto } from '../../common/dto/types';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CertificationTypeDto {
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;
}
export class AbstractCertificationsDto {
  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  status: string;

  // Validate EITHER certificationTypeId or certificationTypeCode, or both if both exist
  @ValidateIf(
    (dto) =>
      typeof dto.certificationTypeCode === 'undefined' ||
      (dto.certificationTypeId && dto.certificationTypeCode),
  )
  @IsString()
  @IsNotEmpty()
  certificationTypeId: string;

  @ValidateIf(
    (dto) =>
      typeof dto.certificationTypeId === 'undefined' ||
      (dto.certificationTypeId && dto.certificationTypeCode),
  )
  @IsString()
  @IsNotEmpty()
  certificationTypeCode: string;
}

export class CertificationsDto
  extends AbstractCertificationsDto
  implements AbstractDto
{
  organisation: string;

  startsAt: Date;
  endsAt?: Date;

  // Validate EITHER farmId or farmCode, or both if both exist
  @ValidateIf(
    (dto) =>
      typeof dto.farmCode === 'undefined' || (dto.farmId && dto.farmCode),
  )
  @IsString()
  @IsNotEmpty()
  farmId?: string;

  @ValidateIf(
    (dto) => typeof dto.farmId === 'undefined' || (dto.farmId && dto.farmCode),
  )
  @IsString()
  @IsNotEmpty()
  farmCode?: string;

  // Validate EITHER plotId or farmCode, or both if both exist
  @ValidateIf(
    (dto) =>
      typeof dto.plotCode === 'undefined' || (dto.plotId && dto.plotCode),
  )
  @IsString()
  @IsNotEmpty()
  plotId?: string;

  @ValidateIf(
    (dto) => typeof dto.plotId === 'undefined' || (dto.plotId && dto.plotCode),
  )
  @IsString()
  @IsNotEmpty()
  plotCode?: string;
}

export class CertificationsDtoCsv
  extends AbstractCertificationsDto
  implements AbstractImportCsvDto
{
  @IsNotEmpty()
  organisation: string;

  startsAt: string;
  endsAt?: string;

  farmCode?: string;
  plotCode?: string;
}

export class CertificationsDtoConnected extends CertificationsDto {
  farm: {
    connect: {
      id: string;
    };
  };
  certificationType: {
    connect: {
      id: string;
    };
  };
  plot: {
    connect: {
      id: string;
    };
  };
}
