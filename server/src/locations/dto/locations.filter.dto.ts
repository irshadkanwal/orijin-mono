import { IsOptional, IsString } from 'class-validator';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';
import { FilterType } from '../../common/prisma.helper';

export class LocationsFilter extends PaginationAndSortingDto {
  @FilterType('text')
  @IsOptional()
  @IsString()
  name?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  shortCode?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  organisation?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  type?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  mainType?: string;
}
