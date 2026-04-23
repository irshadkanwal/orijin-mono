import { FirebaseMetaData } from '../../common/models/firebase-metadata.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class GeoPolygonValues {
  organisation: string;

  // data: GeoDataCoordinate[];
  areaCalculated?: number;
  areaManual?: number;

  // status           String?
  polygon: number[][];

  plotId: string;
  plotCode: string;
}

export class GeodatasDto {
  meta: FirebaseMetaData;
  values: GeoPolygonValues;
}
export class PatchPolygonDto {
  @ApiProperty()
  @IsBoolean()
  active: boolean;
}

export class AbstractPolygonDto {
  @IsNotEmpty()
  shortCode: string;
  status?: string;
  source: string;
}

export class PolygonDto extends AbstractPolygonDto {
  organisation: string;
  areaCalculated?: number;
  coordinates: number[][];
  active: boolean;
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
}

export class PolygonDtoCsv extends AbstractPolygonDto {
  @IsNotEmpty()
  @IsString()
  organisation: string;
  areaCalculated?: string;
  coordinates: number[][];
  active: string;
}

export class PolygonDtoConnected extends PolygonDto {
  plot: {
    connect: {
      id: string;
    };
  };
}
