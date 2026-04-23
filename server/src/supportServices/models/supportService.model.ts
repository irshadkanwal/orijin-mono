import {
  Farmer,
  Location as PrismaLocation,
  SupportingServiceActivityType as PrismaSupportingServiceActivityType,
  SupportingServiceInputType as PrismaSupportingServiceInputType,
  ServiceActivityBeneficiaries,
  ServiceActivityLocation,
  SupportingServiceActivity as PrismaSupportingServiceActivity,
  SupportingServiceCategory as PrismaSupportingServiceCategory,
  SupportingServiceCategoryType as PrismaSupportingServiceCategoryType,
  Prisma,
} from '@prisma/client';
import { BaseModel } from '../../common/models/base.model';

export type SupportServiceCategoryType = PrismaSupportingServiceCategory;

export interface SupportServiceCategory
  extends PrismaSupportingServiceCategoryType {
  supportingServiceCategoryType?: SupportServiceCategoryType;
  service?: SupportServiceCategoryType;
}
export type SupportServiceActivityType = PrismaSupportingServiceActivityType;

export class SupportServiceInputType extends BaseModel {
  supportingServiceCategoryType?: SupportServiceCategoryType;
  shortCode?: string;
  name?: string;
  description?: string;
  deletedAt?: Date;
  service?: SupportServiceCategoryType;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface SupportServiceActivity
  extends PrismaSupportingServiceActivity {
  farmerId?: string;
  farmer?: Farmer;
  supportingServiceCategoryId?: string;
  supportingServiceCategory?: SupportServiceCategory;
  locationId?: string;
  location?: PrismaLocation;
  ServiceActivityBeneficiaries?: ServiceActivityBeneficiaries[];
  serviceActivityLocations?: ServiceActivityLocation[];
  supportingServiceActivityType?: SupportServiceActivityType;
  supportingServiceCategoryType?: SupportServiceCategoryType;
  supportingServiceCategoryTypeId?: string;
  farmerGroupIds?: string[];
  personIds?: string[];
  itemsProcessed?: number | any;
  itemValue?: number | any;
  score?: number | any;
  total?: number | any;
}

export class SupportServiceActivityLocation extends BaseModel {
  id: string;
  supportingServiceActivityId: string;
  supportingServiceActivity: SupportServiceActivity;
  locationId: string;
  location: Location;
}

export type SupportServiceBeneficiary = ServiceActivityBeneficiaries;
