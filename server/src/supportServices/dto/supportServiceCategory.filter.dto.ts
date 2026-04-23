import { FilterType } from '../../common/prisma.helper';
import { StandardFilterDto } from '../../common/dto/paginationAndSorting.dto';
import { IsOptional, IsString } from 'class-validator';

export class SupportServiceCategoryFilterDto extends StandardFilterDto {
  @FilterType('text')
  @IsOptional()
  @IsString()
  categoryType? ;
}
