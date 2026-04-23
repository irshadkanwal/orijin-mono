import { z } from "zod";

export const dashboardDataSchema = z.object({
  name: z.string(),
  total: z.number(),
});

export type DashboardData = z.infer<typeof dashboardDataSchema>;
