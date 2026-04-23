import { z } from "zod";
import { tableFilterQuerySchema } from "./table-filter";

export const locationsTableQuerySchema = tableFilterQuerySchema.extend({
  shortCode: z.string().optional(),
  location: z.string().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  mainType: z.string().optional(),
});

export type LocationsTableQuery = z.infer<typeof locationsTableQuerySchema>;

export enum LocationType {
  DISTRICT = "District",
  SUBCOUNTY = "SubCounty",
  VILLAGE = "Village",
  PARISH = "Parish",
}

export enum CustomLocationType {
  REGION = "Region",
  ZONE = "Zone",
  FARMERGROUP = "FarmerGroup",
}
