import { IsOptional, IsString } from 'class-validator';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';
import { FilterType } from '../../common/prisma.helper';

export class FirestoreOrganisationFilter extends PaginationAndSortingDto {
  @FilterType('text')
  @IsOptional()
  @IsString()
  name?: string;
}
