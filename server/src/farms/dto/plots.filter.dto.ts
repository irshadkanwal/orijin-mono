import { IsOptional, IsString } from 'class-validator';
import { FilterType } from '../../common/prisma.helper';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';

export class PlotsFilter extends PaginationAndSortingDto {
  @FilterType('text')
  @IsOptional()
  @IsString()
  organisation?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  shortCode?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  farmId?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  farmShortcode?: string;
}
