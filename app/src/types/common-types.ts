import { z } from "zod";
import { tableFilterQuerySchema } from "./table-filter";

export const commonTableQuerySchema = tableFilterQuerySchema.extend({
  name: z.string().optional(),
  shortCode: z.string().optional(),
  type: z.string().optional(),
  email: z.string().optional(),
  idCode: z.string().optional(),
  notFarm: z.boolean().optional(),
  categoryType: z.string().optional(),
  operator: z.string().optional(),
  program: z.string().optional(),
  serviceType: z.string().optional(),
  inputType: z.string().optional(),
  activityType: z.string().optional(),
  location: z.string().optional(),
  customLocation: z.string().optional(),
  mainType: z.string().optional(),
});

export type CommonTableQuery = z.infer<typeof commonTableQuerySchema>;
