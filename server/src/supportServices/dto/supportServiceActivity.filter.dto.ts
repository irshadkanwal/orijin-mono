import { PaginationAndSortingDto } from '../../common/dto/paginationAndSorting.dto';

export class SupportServiceActivityFilterDto extends PaginationAndSortingDto {
  organisation?: string;
  personName?: string;
  activityType?: string;
  location?: string;
  customLocation?: string;
  program?: string;
  serviceType?: string;
  inputType?: string;
  gender?: string;
  ageRanges?: string;
  operator?: string;
  tab?:string
}
