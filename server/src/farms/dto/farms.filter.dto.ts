import { IsOptional, IsString } from 'class-validator';
import { FilterType } from '../../common/prisma.helper';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';

export class FarmsFilter extends PaginationAndSortingDto {
  @FilterType('text')
  @IsOptional()
  @IsString()
  organisation?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  text?: string;

  @FilterType('text', 'ID...')
  @IsOptional()
  @IsString()
  shortCode?: string;

  @FilterType('faceted', undefined, 'Location')
  @IsOptional()
  @IsString()
  location?: string;

  @FilterType('faceted', undefined, 'Farmer group')
  @IsOptional()
  @IsString()
  customLocation?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  name?: string;

  // Just a failover for v1..
  @FilterType('text')
  @IsOptional()
  @IsString()
  'facility.name'?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  description?: string;

  @FilterType('select', undefined, 'Season code')
  @IsOptional()
  @IsString()
  seasonCode?: string;

  @FilterType('select', undefined, 'Polygons')
  @IsOptional()
  @IsString()
  polygonStatus?: string;

  @FilterType('select', undefined, 'Deforestation')
  @IsOptional()
  @IsString()
  deforestation?: string;

  @FilterType('select', undefined, 'Updated within')
  @IsOptional()
  @IsString()
  updatedWithin?: string;
}
