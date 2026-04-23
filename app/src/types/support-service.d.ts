import { SearchFrom } from "@/config/rootKeys";
import type {
  SupportServiceActivity as SSA,
  SupportServiceCategory as SSC,
  SupportServiceCategoryType as SSCT,
  SupportServiceActivityLocation as SSAL,
  SupportServiceActivityType as SSAT,
  SupportServiceInputType as SSIT,
  SupportServiceBeneficiary as SSB,
} from "@orijin-server/supportServices/models/supportService.model.ts";

export type SupportServiceActivityType = SSAT;
export type SupportServiceInputType = SSIT;
export type SupportServiceActivity = SSA;
export type SupportServiceCategory = SSC;
export type SupportServiceCategoryType = SSCT;
export type SupportServiceActivityLocation = SSAL;
export type SupportServiceBeneficiary = SSB;

export type ISupportingServiceActivityPerson = {
  id: string;
  supportingServiceActivityId: string;
  SupportServiceActivity: SSA;
  personId: string;
  person: Person;
  name: string;
  shortCode: string;
  formattedData: string;
};

export interface ISupportingServiceDialog {
  formFields: FormFields[];
  isDialogOpen: boolean;
  setDialogClose: (isClosed: boolean) => void;
  onReload: () => void;
  rootKey?: SearchFrom;
}

export interface IManageInputTypeDialogProps extends ISupportingServiceDialog {
  inputType?: SupportServiceInputType;
}

export interface IManageActivityDialogProps extends ISupportingServiceDialog {
  activity?: SupportServiceActivity;
}

export interface IManageCategoryDialogProps extends ISupportingServiceDialog {
  category?: SupportServiceCategory;
}

export interface IManageActivityTypeDialogProps
  extends ISupportingServiceDialog {
  activityType?: SupportServiceActivityType;
}
