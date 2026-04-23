import { z } from "zod";
import { tableFilterQuerySchema } from "./table-filter";

export const supportServiceTableQuerySchema = tableFilterQuerySchema.extend({
  name: z.string().optional(),
  personName: z.string().optional(),
  activityType: z.string().optional(),
  location: z.string().optional(),
  customLocation: z.string().optional(),
  program: z.string().optional(),
  serviceType: z.string().optional(),
  inputType: z.string().optional(),
  gender: z.string().optional(),
  ageRange: z.string().optional(),
  tab: z.string().optional(),
  operator: z.string().optional(),
});

export type SupportServiceTableQuery = z.infer<
  typeof supportServiceTableQuerySchema
>;

export enum ActivityType {
  Distribution = "Distribution",
  IncomeSurvey = "IncomeSurvey",
  Survey = "Survey",
  Training = "Training",
  Other = "Other",
  DemonstrationFarm = "DemonstrationFarm",
  ServiceVisit = "ServiceVisit",
  Internship = "Internship",
}

export enum InputTypeType {
  SEEDLING = "Seedling",
  ANIMALMOUSING = "AnimalHousing",
  DEVICE = "Device",
  OTHER = "Other",
}

export enum BeneficiaryTypeEnum {
  INDIVIDUAL = "INDIVIDUAL",
  GROUP = "GROUP",
}