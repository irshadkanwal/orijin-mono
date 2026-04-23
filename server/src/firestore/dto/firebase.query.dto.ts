import { IsOptional, IsString } from 'class-validator';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';

export class FieldTaskQuery extends PaginationAndSortingDto {
  @IsOptional()
  @IsString()
  workspace?: string;

  @IsOptional()
  @IsString()
  collection?: string;

  @IsOptional()
  @IsString()
  tab?: string;
}
