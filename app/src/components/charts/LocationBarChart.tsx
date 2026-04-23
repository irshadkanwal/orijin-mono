import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import {
  locationChartConfig,
  type LocationType,
} from "@/config/dashboard-config.ts";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useState } from "react";

interface LocationBarChartProps {
  data: Record<string, any>; // The data for either farms or beneficiaries
  countKey: string; // Key to count (e.g., 'farmCount' or 'beneficiaryCount')
  title?: string; // Custom title for the chart
}

export function LocationBarChart({
  data,
  countKey,
  title = "Data by Location",
}: LocationBarChartProps) {
  // Determine if we're using Locations or CustomLocations from the incoming data
  let topLocation: LocationType = "District";
  let subLocation: LocationType = "SubCounty";
  if (data["Zone"]) {
    topLocation = "Zone";
    subLocation = "Region";
  }

  const [locationChartData, setLocationChartData] = useState([]);
  const [selectedType, setSelectedType] = useState<LocationType>(topLocation);

  useEffect(() => {
    const chartType = selectedType === topLocation ? topLocation : subLocation;
    if (!data || !data[chartType]) {
      return;
    }
    const sortedData = data[chartType]
      .sort((a, b) => b[countKey] - a[countKey])
      .filter((entry) => entry[countKey] > 0);

    setLocationChartData(sortedData);
  }, [selectedType, data, countKey]);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex-row justify-center items-center gap-1">
        <CardTitle className="pr-2">{title}</CardTitle>
        <CardDescription>
          <Button
            size="sm"
            onClick={() => {
              setSelectedType(
                selectedType === topLocation ? subLocation : topLocation
              );
            }}
            className="text-base p-2"
            variant="outline"
          >
            {selectedType}
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer
          config={locationChartConfig}
          className="max-h-[250px]"
          style={{ minWidth: 0, width: "100%" }}
        >
          <BarChart data={locationChartData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <XAxis
              dataKey="locationName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
            />
            <YAxis />
            <Bar
              dataKey={countKey}
              stackId="a"
              width={20}
              fill={locationChartConfig[selectedType]?.color || "#8884d8"} // Default color
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
