import { IsOptional, IsString } from 'class-validator';
import { FilterType } from '../../common/prisma.helper';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';

export class CropVarietyFilter extends PaginationAndSortingDto {
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
  description?: string;

  @FilterType('relation')
  @IsOptional()
  @IsString()
  cropCode?: string;

  @FilterType('relation')
  @IsOptional()
  @IsString()
  ['crop.name']?: string;
}
