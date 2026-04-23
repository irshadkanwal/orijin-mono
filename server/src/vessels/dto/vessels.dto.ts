import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { AbstractDto, AbstractImportCsvDto } from '../../common/dto/types';
export class AbstractVesselsDto {
  @IsNotEmpty()
  shortCode: string;
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  subType: string;

  description?: string | null;
}

export class VesselsDtoCsv
  extends AbstractVesselsDto
  implements AbstractImportCsvDto
{
  @IsNotEmpty()
  organisation: string;

  permanent?: string;
  size?: string | null;
  weight?: string | null;

  plotCode?: string;
  facilityCode?: string;
}
export class VesselsDto extends AbstractVesselsDto implements AbstractDto {
  organisation: string;

  permanent?: boolean;
  size?: number | null;
  weight?: number | null;

  // Validate EITHER plotId or plotCode, or both if both exist
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


  // Validate EITHER facilityId or facilityCode, or both if both exist
  @ValidateIf(
    (dto) =>
      typeof dto.facilityCode === 'undefined' || (dto.facilityId && dto.facilityCode),
  )
  @IsString()
  @IsNotEmpty()
  facilityId?: string;

  @ValidateIf(
    (dto) => typeof dto.facilityId === 'undefined' || (dto.facilityId && dto.facilityCode),
  )
  @IsString()
  @IsNotEmpty()
  facilityCode?: string;


}

export class VesselsDtoConnected extends VesselsDto {
  plot?: {
    connect: {
      id: string;
    };
  };
  facility?: {
    connect: {
      id: string;
    };
  };
}
