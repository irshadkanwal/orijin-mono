import { tableFilterQuerySchema } from "./table-filter";
import { z } from "zod";
export const fieldTaskQuerySchema = tableFilterQuerySchema.extend({
  workspace: z.string().optional(),
  collection: z.string().optional(),
});

export type FieldTaskQuery = z.infer<typeof fieldTaskQuerySchema>;
