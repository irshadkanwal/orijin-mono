import type { ZodSchema, ZodTypeDef } from "zod";
// eslint-disable-next-line no-duplicate-imports
import { z } from "zod";
import { tableFilterQuerySchema } from "./table-filter";

export const personsTableQuerySchema = tableFilterQuerySchema.extend({
  shortCode: z.string().optional(),
  location: z.string().optional(),
});

export type PersonsTableQuery = ZodSchema<
  z.output<typeof personsTableQuerySchema>,
  ZodTypeDef,
  z.input<typeof personsTableQuerySchema>
>;

export const genderTypes = ["male", "female"] as const;
export type GenderType = (typeof genderTypes)[number];
export const genderTypeSchema = z.enum(genderTypes);

export const ageRanges: { label: string; value: string }[] = [
  { label: "<18", value: "0-17" },
  { label: "18-30 (Youth)", value: "18-30" },
  { label: "31-50", value: "31-50" },
  { label: ">51 (Elder)", value: "50+" },
];
