import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { AbstractDto, AbstractImportCsvDto } from '../../common/dto/types';

export class CropsDtoCsv implements AbstractImportCsvDto {
  @IsNotEmpty()
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;

  description?: string | null;
}

export class CropsDto implements AbstractDto {
  organisation: string;

  @IsNotEmpty()
  shortCode: string | null;

  @IsNotEmpty()
  name: string;

  description?: string | null;
}

export class AbstractCropVarietyDto {
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;

  description?: string;
}

export class CropVarietyDtoCsv extends AbstractCropVarietyDto {
  @IsNotEmpty()
  cropCode?: string;
}

export class CropVarietyDtoConnected extends AbstractCropVarietyDto {
  crop: {
    connect: {
      id: string;
    };
  };
}

export class CropVarietyDto extends AbstractCropVarietyDto {
  // Not annotated because validates as part of URL
  organisation: string;

  // Validate EITHER cropId or cropCode, or both if both exist
  @ValidateIf(
    (dto) =>
      typeof dto.cropCode === 'undefined' || (dto.cropId && dto.cropCode),
  )
  @IsString()
  @IsNotEmpty()
  cropId?: string;

  @ValidateIf(
    (dto) => typeof dto.cropId === 'undefined' || (dto.cropId && dto.cropCode),
  )
  @IsString()
  @IsNotEmpty()
  cropCode?: string;
}
