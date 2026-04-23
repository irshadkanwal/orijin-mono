import { Label, Pie, PieChart } from "recharts";
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
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type PieChartData = {
  key: string;
  value: number;
  color?: string;
};

type PieChartComponentProps = {
  title: string;
  subTitle?: string;
  summaryExplanationText?: string;
  chartData: PieChartData[];
  dataKey?: string;
  nameKey?: string;
  footerContent?: React.ReactNode;
  containerClassName?: string;
  pieClassName?: string;
  className?: string;
  summaryType?: "int" | "decimal" | "disabled";
};

export function GenericPieChart({
  title,
  subTitle,
  chartData,
  dataKey = "value",
  nameKey = "key",
  footerContent,
  containerClassName = "mx-auto aspect-square max-h-[250px]",
  pieClassName,
  className,
  summary,
  summaryExplanationText,
  summaryType = "decimal",

}: PieChartComponentProps) {
  const DEFAULT_COLOR = "#2563eb";

  // Create the config object dynamically based on the passed chart data
  const config = useMemo(() => {
    return chartData.reduce(
      (acc, { key, color }) => {
        acc[key] = {
          label: key,
          color: color || DEFAULT_COLOR,
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>
    );
  }, [chartData]);

  const total = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  const defaultLabelFormatter = () => (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      className="fill-foreground text-3xl font-bold"
    >
      {/* A large text without number */}
      {summaryType === "disabled" && summaryExplanationText && (
        <tspan x="50%" className="text-accent text-sm font-normal">
          {summaryExplanationText}
        </tspan>
      )}

      {/* A number and text as caption */}
      {summaryType !== "disabled" && (
        <>
          {summaryType === "decimal" ? total.toFixed(2) : total}
          {summaryExplanationText && (
            <tspan
              x="50%"
              dy="24"
              className="fill-muted-foreground text-sm font-normal"
            >
              {summaryExplanationText}
            </tspan>
          )}
        </>
      )}
    </text>
  );

  return (
    <Card className={cn(className, "flex flex-col")}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {subTitle && <CardDescription>{subTitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={config} className={containerClassName}>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map(({ key, value }) => ({
                key,
                value,
                fill: config[key]?.color,
              }))}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={75}
              outerRadius={100}
              strokeWidth={5}
              className={pieClassName}
            >
              <Label content={defaultLabelFormatter} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {footerContent}
      </CardFooter>
    </Card>
  );
}
