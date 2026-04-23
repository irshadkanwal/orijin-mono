import { z } from "zod";
// eslint-disable-next-line no-duplicate-imports
import { tableFilterQuerySchema } from "./table-filter";

export const farmsDashboardQuerySchema = tableFilterQuerySchema.extend({
  location: z.string().optional(),
  customLocation: z.string().optional(),
  seasonCode: z.string().optional(),
});

export const farmsTableQuerySchema = tableFilterQuerySchema.extend({
  shortCode: z.string().optional(),
  location: z.string().optional(),
  customLocation: z.string().optional(),
  seasonCode: z.string().optional(),
  polygonStatus: z.string().optional(),
  deforestation: z.string().optional(),
  updatedWithin: z.string().optional(),
  minimalResults: z.boolean().optional(),
  tab: z.string().optional(),
});

export type FarmsTableQuery = z.output<typeof farmsTableQuerySchema>;

export type FarmsDashboardQuery = z.output<typeof farmsDashboardQuerySchema>;
