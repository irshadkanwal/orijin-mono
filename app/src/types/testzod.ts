import type { ZodSchema, ZodTypeDef } from "zod";
// eslint-disable-next-line no-duplicate-imports
import { z } from "zod";

// Define a Zod schema
const userSchema = z.object({
  page: z.number().default(1),
  sort: z.string().optional(),
  sortOrder: z.string().optional(),
  name: z.string().optional(),
  age: z.number().optional(),
});

const extendedUserSchema = userSchema.extend({
  email: z.string().email().optional(),
});

// Infer the type from the schema
export type User = z.output<typeof userSchema>;
export type ExtendedUser = z.infer<typeof extendedUserSchema>;

type UserInput = z.input<typeof userSchema>;
type UserOutput = z.output<typeof userSchema>;

// The types of '_input.page' are incompatible between these types.
//   Type 'number | undefined' is not assignable to type 'number'.
const t: ZodSchema<UserOutput, ZodTypeDef, UserInput> = userSchema;
console.log(t);

type zd = ZodSchema<UserOutput, ZodTypeDef, UserInput>;
const x: zd = userSchema;
const y: zd = extendedUserSchema;
console.log(x, y);
