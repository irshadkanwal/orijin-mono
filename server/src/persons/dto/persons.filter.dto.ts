import { IsOptional, IsString } from 'class-validator';
import { FilterType } from '../../common/prisma.helper';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';

export class PersonsFilter extends PaginationAndSortingDto {
  // Passed in at the controller
  organisation?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  text?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  shortCode?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  @FilterType('text')
  name?: string;

  @IsOptional()
  includeActivities?: boolean;
}
