import {
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';

export class AbstractDto {
  organisation: string;

  @IsNotEmpty()
  type: string;

  @IsString()
  name: string;

  @IsEnum(['INDIVIDUAL', 'GROUP'])
  @IsNotEmpty()
  beneficiaryType: string;
}

export class SupportServiceActivityTypeDtoCsv extends AbstractDto {
  @IsNotEmpty()
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  supportingServiceCategoryCode: string;

  supportingServiceInputTypeCode: string;
}

export class SupportServiceActivityTypeDto extends AbstractDto {
  organisation: string;
  shortCode: string;

  supportingServiceCategoryId: string;
  supportingServiceCategoryCode: string;
  supportingServiceInputTypeCode: string;
  supportingServiceInputTypeId: string;
}

export class CreateSupportServiceActivityTypeDtoConnected extends SupportServiceActivityTypeDto {
  supportingServiceCategory: {
    connect: { id: string };
  };
}
export class SupportServiceActivityTypesFilterDto extends PaginationAndSortingDto {
  organisation?: string;
}
