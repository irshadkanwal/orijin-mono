import { ChartConfig } from "@/components/ui/chart";

export const locationChartConfig = {
  District: {
    label: "District",
    color: "#2563eb",
  },
  Zone: {
    label: "Zone",
    color: "#2563eb",
  },
  SubCounty: {
    label: "SubCounty",
    color: "#10b981",
  },
  Region: {
    label: "Region",
    color: "#10b981",
  },
} satisfies ChartConfig;
export type LocationType = keyof typeof locationChartConfig;
