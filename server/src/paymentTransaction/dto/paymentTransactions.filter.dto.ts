import { IsOptional, IsString } from 'class-validator';
import { FilterType } from '../../common/prisma.helper';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';

export class PaymentTransactionsFilter extends PaginationAndSortingDto {
  // Passed in at the controller
  organisation?: string;
  @IsOptional()
  @IsString()
  @FilterType('text')
  
  @FilterType('text')
  @IsOptional()
  @IsString()
  name?: string;
}
