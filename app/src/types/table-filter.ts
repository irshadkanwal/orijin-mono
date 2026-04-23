import type { ZodSchema, ZodTypeDef } from "zod";
// eslint-disable-next-line no-duplicate-imports
import { z } from "zod";

/**
 * Validation for the URL search params.
 */
export const tableFilterQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  sort: z.string().optional(),
  sortOrder: z.string().optional(),
});

export type TableFilterSchema = ZodSchema<
  z.output<typeof tableFilterQuerySchema>,
  ZodTypeDef,
  z.input<typeof tableFilterQuerySchema>
>;
