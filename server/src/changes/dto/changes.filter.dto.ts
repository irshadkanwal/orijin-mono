import { FilterType } from 'src/common/prisma.helper';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { ChangeSourceType } from '../models/changes.model';

export class ChangesFilter extends PaginationAndSortingDto {
  @FilterType('text')
  @IsOptional()
  @IsString()
  id?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  objectId?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  objectType?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  sourceType?: ChangeSourceType;

  @FilterType('date')
  @IsOptional()
  @IsDate()
  startTime?: Date;

  @FilterType('date')
  @IsOptional()
  @IsDate()
  endTime?: Date;

  @FilterType('text')
  @IsOptional()
  @IsString()
  name?: string;

  @FilterType('text')
  @IsOptional()
  @IsString()
  newValue?: string;
}
