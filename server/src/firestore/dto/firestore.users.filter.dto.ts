import { IsOptional, IsString } from 'class-validator';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';
import { FilterType } from '../../common/prisma.helper';

export class FirestoreUsersFilter extends PaginationAndSortingDto {
  @FilterType('text')
  @IsOptional()
  @IsString()
  email?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  organization?: string;
}
