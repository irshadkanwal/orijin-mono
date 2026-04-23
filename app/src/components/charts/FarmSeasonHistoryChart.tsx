import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CardFooter } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type SeasonData = {
  seasonShortCode: string;
  areaOfFarm: number;
  numberOfPlots: number;
};

const chartConfig = {
  areaOfFarm: {
    label: "Area of Farm",
    color: "hsl(var(--chart-dark-orange))",
  },
  numberOfPlots: {
    label: "Number of Plots",
    color: "hsl(var(--chart-blue))",
  },
  countOfTrees: {
    label: "Productive trees (in hundreds)",
    color: "hsl(var(--chart-green))",
  },
} satisfies ChartConfig;

function FarmSeasonHistoryChart({
  chartData,
}: {
  chartData: SeasonData[] | undefined;
}) {
  return (
    <>
      <ChartContainer config={chartConfig} style={{ maxHeight: 400 }}>
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="seasonShortCode"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <ChartLegend content={<ChartLegendContent />} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar
            dataKey="areaOfFarm"
            name={chartConfig.areaOfFarm.label}
            fill={chartConfig.areaOfFarm.color}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="numberOfPlots"
            name={chartConfig.numberOfPlots.label}
            fill={chartConfig.numberOfPlots.color}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="countOfTrees"
            name={chartConfig.countOfTrees.label}
            fill={chartConfig.countOfTrees.color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none text-muted-foreground">
          Showing data for the last {chartData?.length} farming seasons
        </div>
      </CardFooter>
    </>
  );
}

export default FarmSeasonHistoryChart;
