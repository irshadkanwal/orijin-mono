import {
  createFileRoute,
  useLoaderData,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { rootKeys } from "@/config/rootKeys";
import { Icons } from "@/components/icons";
import {
  farmsPerLocationQueryOptions,
  farmStatsQueryOptions,
} from "@/services/dashboard-service";
import { useEffect, useRef } from "react";
import { LocationBarChart } from "@/components/charts/LocationBarChart.tsx";
import { GaugeChart } from "@/components/charts/GaugeChart.tsx";
import { GenericPieChart } from "@/components/charts/pie/PieChart";
import { SingleValueChart } from "@/components/charts/SingleValueChart.tsx";
import { farmsDashboardQuerySchema } from "@/types/farms-types.ts";
import { DataTableToolbar } from "@/components/table/datatable-toolbar.tsx";
import { filtersQueryOptions } from "@/services/filters-service.ts";
import { updateTableFilters } from "@/config/farms-column.tsx";
import ExportPdfButton from "@/components/export-pdf-button";
import { PageTitle } from "@/components/page-title";
import { PolygonWarningChart } from "@/components/charts/PolygonWarningsBarChart";
import { DashboardTable } from "@/components/dashboard-table/dashboard-table.tsx";
import {
  growers_summary_mock_data,
  summary_of_acrees_mock_data,
} from "@/components/dashboard-table/mock-data";

export const Route = createFileRoute(rootKeys.dashboard)({
  loaderDeps: ({ search }) => {
    const parsed = farmsDashboardQuerySchema.safeParse(search);
    if (!parsed.success) {
      throw new Error("Invalid search parameters");
    }
    return { ...parsed.data };
  },

  loader: async (opts) => {
    const { queryClient, auth } = opts.context;
    console.log("opts.deps", opts.deps);
    const org = auth.organisations.current;
    const token = auth.currentUser?.accessToken;

    // FIXME: so these are oficially farm filters, but they fit for a dashboard too
    const filters = await queryClient.ensureQueryData(
      filtersQueryOptions("farms", org, token)
    );

    const dashboardFilters = updateTableFilters(filters, [
      "location",
      "customLocation",
      "seasonCode",
    ]);

    // Actual stats
    const farmStatsPromise = queryClient.ensureQueryData(
      farmStatsQueryOptions(org, opts.deps, token)
    );
    const farmsPerLocationPromise = queryClient.ensureQueryData(
      farmsPerLocationQueryOptions(org, opts.deps, token)
    );

    const [farmStats, farmsPerLocation] = await Promise.all([
      farmStatsPromise,
      farmsPerLocationPromise,
    ]);

    return {
      plotStats: farmStats?.plots,
      totalFarmCount: farmStats?.farmCount || 0,
      farmsPerLocation: farmsPerLocation,
      averagePolygonSize: farmStats?.averagePolygonSize || 0,
      genders: farmStats?.genders || { female: 0, male: 0 },
      totalPolygonSizes: parseFloat(farmStats?.totalPolygonSizes) || 0,
      totalPersonCount:
        farmStats?.genders.female + farmStats?.genders.male || 0,
      filters: dashboardFilters,
      polygonWarningsCount: farmStats?.polygonWarningsCount,
    };
  },

  component: DashboardComponent,
});

function DashboardComponent() {
  const loaderData = useLoaderData({ from: rootKeys.dashboard });
  const pageRef = useRef(null);

  const {
    totalFarmCount,
    plotStats,
    farmsPerLocation,
    averagePolygonSize,
    totalPolygonSizes,
    genders,
    filters,
    polygonWarningsCount,
  } = loaderData;

  const avgPolygonSize = !isNaN(parseFloat(averagePolygonSize))
    ? parseFloat(averagePolygonSize)?.toFixed(2)
    : "n/a";

  const { auth } = useRouteContext({ from: rootKeys.dashboard });
  const router = useRouter();
  useEffect(() => {
    router.cleanCache();
    void router.invalidate();
  }, [auth.organisations.current]);

  const plotAnalysisStatus = [
    {
      key: "no-polygon", //
      value: plotStats?.noPolygons || 0,
      color: "gray",
    },
    {
      key: "faulty-polygon",
      value: plotStats?.invalidPolygons || 0,
      color: "orange",
    },
    {
      key: "polygon-ok-not-analysed",
      value: plotStats?.pendingAnalysis || 0,
      color: "hsl(var(--chart-dark-orange))",
    },
    {
      key: "analysed-with-risk", //
      value: plotStats?.hasRisk || 0,
      color: "orange",
    },
    {
      key: "analysed-ok",
      value: plotStats?.noRisk || 0,
      color: "hsl(var(--chart-green))",
    },
  ];

  const warningChartData = [
    // TODO: auto-generate these from backend results!!
    {
      key: "Overlaps 1 plot",
      value: polygonWarningsCount?.["Overlap 1"] || 0,
      color: "hsl(var(--primary))",
    },
    {
      key: "Overlaps 2-3 plots",
      value: polygonWarningsCount?.["Overlap 2-3"] || 0,
      color: "hsl(var(--primary))",
    },
    {
      key: "Overlaps 4 or more plots",
      value: polygonWarningsCount?.["Overlap 4 or more"] || 0,
      color: "hsl(var(--primary))",
    },
    {
      key: "Interaction-polygon-overlapping",
      value: polygonWarningsCount?.["Interaction-polygon-overlapping"] || 0,
      color: "hsl(var(--primary))",
    },
    {
      key: "Not-enough-points",
      value: polygonWarningsCount?.["Not-enough-points"] || 0,
      color: "hsl(var(--chart-green))",
    },
    {
      key: "First-and-last-point-are-not-equivalent",
      value:
        polygonWarningsCount?.["First-and-last-point-are-not-equivalent"] || 0,
      color: "hsl(var(--chart-dark-orange))",
    },
    {
      key: "Distance-between-every-point-is-too-large",
      value:
        polygonWarningsCount?.["Distance-between-every-point-is-too-large"] ||
        0,
      color: "hsl(var(--chart-dark-green))",
    },
    {
      key: "Spikes",
      value: polygonWarningsCount?.["Spikes"] || 0,
      color: "hsl(var(--chart-orange))",
    },
    {
      key: "Self-intersects",
      value: polygonWarningsCount?.["Self-intersects"] || 0,
      color: "hsl(var(--chart-yellow))",
    },
    {
      key: "Area-too-small",
      value: polygonWarningsCount?.["Area-too-small"] || 0,
      color: "#2563eb",
    },
    {
      key: "Area-too-large",
      value: polygonWarningsCount?.["Area-too-large"] || 0,
      color: "#B43F3F",
    },
  ];

  return (
    <div
      className="flex-1 space-y-4 p-8 pt-6 overflow-auto min-w-full max-w-[calc(100vh-200px)]"
      id="dashboard-component"
      ref={pageRef}
    >
      <PageTitle title={"Dashboard"} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataTableToolbar
          searchFrom={rootKeys.dashboard}
          filters={filters}
          tableQuerySchema={farmsDashboardQuerySchema}
        />
        <ExportPdfButton
          elementRef={pageRef}
          filename="dashboard"
          className="absolute right-8"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SingleValueChart
          title="Total farms"
          value={totalFarmCount}
          units="farms"
          Icon={Icons.tractor}
        />
        <SingleValueChart
          title="Total plots"
          value={plotStats?.total}
          units=""
          Icon={Icons.landPlot}
        />
        <SingleValueChart
          title="Total area from plots"
          value={(totalPolygonSizes || 0).toFixed(2)}
          units="hectares"
          Icon={Icons.mapPin}
        />
        <SingleValueChart
          title="Average plot size"
          value={avgPolygonSize}
          units="hectares"
          Icon={Icons.user}
        />
        <GenericPieChart
          title="Plot Status"
          subTitle="Analysis Status of Plots"
          chartData={plotAnalysisStatus}
          summaryType={"int"}
          summaryExplanationText="Total plots"
          footerContent={<div className="flex flex-col gap-2 text-sm"></div>}
        />
        <LocationBarChart
          data={farmsPerLocation}
          countKey="farmCount"
          title="Farms by Location"
        />
        <GaugeChart
          title="Gender split"
          subTitle={`Out of total ${genders.female + genders.male} farmers`}
          summary={`${genders.female} / ${genders.male}`}
          explanation="Female / Male"
          chartData={[
            {
              month: "january",
              valueLeft: genders.female,
              valueRight: genders.male,
            },
          ]}
        />
        {warningChartData.filter((item) => item.value > 0).length > 0 && (
          <PolygonWarningChart
            polygonWarningsCount={warningChartData}
            warningText="Warnings from active polygons"
          />
        )}
      </div>
      {/*<DashboardTable*/}
      {/*  data={growers_summary_mock_data}*/}
      {/*  tableHeader="Growers List Summary for Season (DRAFT - data not live)"*/}
      {/*/>*/}
      {/*<DashboardTable*/}
      {/*  data={summary_of_acrees_mock_data}*/}
      {/*  tableHeader="Summary of Acres for Season 2024/25"*/}
      {/*/>*/}
    </div>
  );
}
