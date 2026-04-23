import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FacilityType } from '../models/facility.model';
import { Address, Location } from '../../locations/models/locations.model';
import { PersonsDto } from '../../persons/dto/persons.dto';
import { Prisma } from '@prisma/client';
import {
  StandardFilterDto,
} from '../../common/dto/paginationAndSorting.dto';
import { FilterType } from '../../common/prisma.helper';

export class AbstractDto {
  organisation: string;

  @IsNotEmpty()
  @IsString()
  shortCode: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  type: FacilityType;

  timezone?: string;
}
export class FacilitiesDtoCsv extends AbstractDto {
  @IsNotEmpty()
  organisation: string;
  mainContactPersonCode?: string;
  locationCode?: string;
  customLocationCode?: string;
  areaTotalManual?: string;
}
export class FacilitiesDto extends AbstractDto {
  id?: string;
  firestoreId?: string;

  mainContactPerson?: PersonsDto;
  mainContactPersonId?: string;

  locationId?: string;
  location?: Location;
  customLocation?: Location;
  customLocationId?: string

  areaTotalManual: number;
  address?: Address;
  coordinate?: GeoCoordinateInput;
  countryIso?: string;
}

// export class FacilitiesDtoConntected extends AbstractDto {
//   mainContactPerson?: { connect: { id: string } };
//
//   location?: { connect: { id: string } };
//   customLocation?: { connect: { id: string } };
//
//   areaTotalManual: Prisma.Decimal;
//   address?: Address;
//
//   coordinate?: { create: GeoCoordinateInput };
// }

export class FacilityFilterDto extends StandardFilterDto {
  type?: string;

  @FilterType("boolean")
  @IsOptional()
  @IsString()
  notFarm?: string;
}

export class GeoCoordinateInput {
  latitude: number;
  longitude: number;
  altitude?: number;
}
