import {
  IsArray,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';

export class AbstractDto {
  organisation: string;

  @IsNotEmpty()
  type: string;

  @IsString()
  name: string;
}

export class SupportServiceInputTypeDtoCsv extends AbstractDto {
  @IsNotEmpty()
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  supportingServiceCategoryCode: string;
}

export class SupportServiceInputTypeDto extends AbstractDto {
  organisation: string;
  shortCode: string;

  @IsString()
  @IsNotEmpty()
  supportingServiceCategoryId: string;

  supportingServiceCategoryCode: string;
}

export class CreateSupportServiceInputTypeDtoConnected extends SupportServiceInputTypeDto {
  supportingServiceCategory: {
    connect: { id: string };
  };
}

export class SupportServiceInputTypesFilterDto extends PaginationAndSortingDto {
  organisation?: string;

  @IsOptional()
  shortCode?: string;
}
