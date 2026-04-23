import { FilterType } from '../prisma.helper';
import { IsOptional, IsString } from 'class-validator';
import { CropVariety } from '@prisma/client';

export class PaginationAndSortingOutputDto<A> {
  data: A[];
  count: number;
}
export interface GetOneInput {
  id?: string;
  shortCode?: string;
  org: string;
}

export interface IPaginationAndSorting {
  page?: string;
  limit?: string;
  sort?: string;
  sortOrder?: string;
}

export class PaginationAndSortingDto {
  @FilterType('text')
  @IsString()
  @IsOptional()
  page?: string;

  @FilterType('text')
  @IsString()
  @IsOptional()
  limit?: string;

  @FilterType('text')
  @IsString()
  @IsOptional()
  order?: string;

  @FilterType('text')
  @IsString()
  @IsOptional()
  sort?: string;

  @FilterType('text')
  @IsString()
  @IsOptional()
  sortOrder?: string;
}

export class StandardFilterDto extends PaginationAndSortingDto {
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
}
