import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Link } from "@tanstack/react-router";

type WarningData = {
  key: string;
  value: number;
  color: string;
};

type PolygonWarningChartProps = {
  polygonWarningsCount: WarningData[];
  title?: string;
  description?: string;
  defaultColor?: string;
  tooltipContent?: React.ReactNode;
  warningText?: string;
  labelFormatter?: (value: string) => string;
};

export function PolygonWarningChart({
  polygonWarningsCount,
  title = "Plot overlap warnings",
  description = "Warnings Count",
  defaultColor = "#2563eb",
  tooltipContent = <ChartTooltipContent indicator="line" />,
  warningText,
  labelFormatter = (value) => value.slice(0, 3),
}: PolygonWarningChartProps) {
  const chartData = React.useMemo(() => {
    return polygonWarningsCount
      .filter(({ value }) => value > 0)
      .map(({ key, value, color }) => ({
        warnings: key,
        counts: value,
        fill: color || defaultColor,
      }));
  }, [polygonWarningsCount, defaultColor]);

  const config = React.useMemo(() => {
    return polygonWarningsCount.reduce(
      (acc, { key, color }) => {
        acc[key] = {
          label: key,
          color: color || defaultColor,
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>
    );
  }, [polygonWarningsCount, defaultColor]);

  const totalWarning = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.counts, 0);
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart data={chartData} layout="vertical" margin={{ right: 33 }}>
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="warnings"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={labelFormatter}
              hide
            />
            <XAxis dataKey="counts" type="number" hide />
            <ChartTooltip cursor={false} content={tooltipContent} />
            <Bar dataKey="counts" layout="vertical" radius={4}>
              <LabelList
                dataKey="warnings"
                position="insideLeft"
                offset={8}
                className="fill-background"
                fontSize={12}
              />
              <LabelList
                dataKey="counts"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {warningText ? warningText : ""} (Total: {totalWarning})
        </div>
        {warningText && (
          <div className="leading-none text-muted-foreground">
            <Link
              to={"/farms" + "?polygonStatus=WARNINGS"}
              className="blue underline"
            >
              View farms with error
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
