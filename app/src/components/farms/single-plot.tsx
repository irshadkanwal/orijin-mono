import { GaugeChart } from "@/components/charts/GaugeChart.tsx";
import { GenericPieChart } from "@/components/charts/pie/PieChart.tsx";
import { Icons } from "@/components/icons.tsx";
import { PrintKeyValue } from "@/components/print-key-value.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Route } from "@/routes/_loggedin/farms/$farmId.tsx";
import {
  requestAnalysisStart,
  requestAnalysisUpdate,
  updatePolygon,
  useRequestAnalysisUpdateMutation,
  useUpdatePolygon,
} from "@/services/farm-service.ts";
import type { Plot, Polygon, PolygonForMap } from "@/types/farm";
import React, { useEffect, useState } from "react";
import * as turf from "@turf/turf";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Switch } from "@/components/ui/switch.tsx";

// TODO: Copied from backend, create proper export
export enum CountType {
  MainCrop = "MainCrop",
  Shade = "Shade",
  Goat = "Goat",
  Cow = "Cow",
  Chicken = "Chicken",
}

export enum CountSubType {
  Productive = "Productive",
  Young = "Young",
  Stumped = "Stumped",
}

const getLatestSatellite = (plot: Plot) => {
  if (!plot.satelliteAnalysis || plot.satelliteAnalysis.length === 0) {
    return {
      area: 0,
      deforestationRisk: "",
      deforestationAreaHa: 0,
      status: "PENDING",
    };
  }
  return plot.satelliteAnalysis[plot.satelliteAnalysis.length - 1];
};

const NA_STRING = "-";

const getTreeCounts = (plot: Plot) => {
  const productive = plot.plotCountItems.filter(
    (count) =>
      count.type === CountType.MainCrop &&
      count.subType === CountSubType.Productive
  );
  const young = plot.plotCountItems.filter(
    (count) =>
      count.type === CountType.MainCrop && count.subType === CountSubType.Young
  );
  const stumped = plot.plotCountItems.filter(
    (count) =>
      count.type === CountType.MainCrop &&
      count.subType === CountSubType.Stumped
  );
  const shade = plot.plotCountItems.filter(
    (count) => count.type === CountType.Shade
  );
  return {
    productive: productive[0]?.count || NA_STRING,
    young: young[0]?.count || NA_STRING,
    stumped: stumped[0]?.count || NA_STRING,
    shade: shade[0]?.count || NA_STRING,
  };
};

const getLatestPolygonArea = (currentPolygon: PolygonForMap, acres = false) => {
  const area = currentPolygon?.areaCalculated;
  if (!area) {
    return NA_STRING;
  }
  const float = parseFloat(area.toString());
  if (acres) {
    return (float * 2.47105).toFixed(2);
  }
  return float.toFixed(2);
};

function average(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function calculatePointsDistance(points: turf.Position[] | undefined) {
  if (!points) return {};

  if (points.length === 1) return { distanceArr: [], avg: 0, min: 0, max: 0 };

  const distanceArr: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    if (points[i][0] === points[i + 1][0] && points[i][1] === points[i + 1][1])
      continue;

    const distanceBetween = turf.distance(
      turf.point(points[i]),
      turf.point(points[i + 1]),
      { units: "meters" }
    );
    distanceArr.push(distanceBetween);
  }

  return {
    distanceArr: distanceArr,
    avg: Math.round(average(distanceArr)),
    min: Math.round(Math.min(...distanceArr)),
    max: Math.round(Math.max(...distanceArr)),
  };
}

type SinglePlotProps = {
  plot: Plot;
  farmId: string;
  selectedPolygon?: Polygon;
  onPolygonChange: (polygon: Polygon) => void;
};

export function SinglePlot({
  plot,
  farmId,
  selectedPolygon,
  onPolygonChange,
}: SinglePlotProps) {
  const {
    auth: { currentUser, organisations },
  } = Route.useRouteContext();

  const updatePolygonMutation = useUpdatePolygon(
    currentUser?.accessToken || "",
    updatePolygon
  );

  const requestSatelliteAnalysisMutation = useRequestAnalysisUpdateMutation(
    organisations.current,
    currentUser?.accessToken || "",
    requestAnalysisStart
  );

  const requestAnalysisResultMutation = useRequestAnalysisUpdateMutation(
    organisations.current,
    currentUser?.accessToken || "",
    requestAnalysisUpdate
  );

  const [viewOriginal, setViewOriginal] = useState(false);

  useEffect(() => {
    const indexOfActivePolygon = plot.polygons.findIndex((poly) => poly.active);
    const polygon = viewOriginal
      ? plot.polygons[indexOfActivePolygon - 1]
      : plot.polygons[indexOfActivePolygon];

    if (polygon) {
      onPolygonChange(polygon);
    }
  }, [viewOriginal]);

  if (!plot) {
    return <></>;
  }

  const latestSatellite = getLatestSatellite(plot);
  const deforestationSummary =
    latestSatellite.status === "PENDING"
      ? "(Analysis pending)"
      : `${parseFloat(latestSatellite.deforestationAreaHa).toFixed(2)} ha`;
  const deforestationExplanation =
    latestSatellite.status === "PENDING"
      ? "Analysis not yet done"
      : `${((latestSatellite.deforestationAreaHa / latestSatellite.area) * 100).toFixed(1)} % of ${parseFloat(latestSatellite.area).toFixed(2)} ha`;

  const plotAnalysisStatus = [
    {
      key: "No trees", //
      value: parseFloat(latestSatellite?.landcoverNoTreesCoverage || 0),
      color: "gray",
    },
    {
      key: "Shrubs",
      value: parseFloat(latestSatellite?.landcoverShrubsCoverage || 0),
      color: "orange",
    },
    {
      key: "Plantation", //
      value: parseFloat(latestSatellite?.landcoverPlantationCoverage || 0),
      color: "hsl(var(--chart-dark-orange))",
    },
    {
      key: "Forest",
      value: parseFloat(latestSatellite?.landcoverForestCoverage || 0),
      color: "hsl(var(--chart-green))",
    },
  ];

  const handlePolygonSwitch = (poly) => {
    // TODO: Change to given polygon, not just orig/current
    setViewOriginal((prev) => !prev);
  };

  const onSwitchChange = (checked: boolean) => {
    if (!selectedPolygon) return;
    updatePolygonMutation.mutate({
      id: selectedPolygon.id,
      active: !checked,
    });
  };

  const getSortedPolygons = (polygons: Polygon[]) => {
    return [...polygons].sort((a, b) => {
      const byTime =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (byTime === 0) {
        // If the autofix happened on same second as import, place autofix first
        if (a.source === "AUTOFIX") {
          return -1;
        } else {
          return 1;
        }
      }
      return byTime;
    });
  };

  const displayDisalingButton = false; // TODO: Agree with customers and then enable for appropriate users

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2  ">
          <CardContent>
            <div className="grid gap-3 my-4">
              <div className="font-semibold flex items-center justify-between">
                Polygon status & warnings
              </div>
              <div className="rounded-lg border border-gray-200 overflow-auto">
                <div className="min-w-[450px] overflow-hidden">
                  <table className="text-[12px] min-w-full text-center">
                    <thead className="text-muted-foreground">
                      <tr>
                        <th className="py-1 px-2" rowSpan={2}>
                          Source
                        </th>
                        <th className="py-1 px-2" rowSpan={2}>
                          Points
                        </th>
                        <th className="pt-1 px-2 whitespace-nowrap" colSpan={3}>
                          Points distance (m)
                        </th>
                        <th className="py-1 px-2" rowSpan={2}>
                          Warnings
                        </th>
                        <th className="py-1 px-2" rowSpan={2}>
                          Active
                        </th>
                      </tr>
                      <tr>
                        <th className="pb-1 px-2">Avg</th>
                        <th className="pb-1 px-2">Max</th>
                        <th className="pb-1 px-2">Min</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedPolygons(plot.polygons).map((poly: Polygon) => {
                        const pointsDistance = calculatePointsDistance(
                          poly.coordinates
                        );
                        const filteredWarnings = poly.polygonWarnings.filter(
                          (warning) => !warning.fixed
                        );
                        const filteredInteractionWarnings =
                          poly.polygonInteractionWarnings.filter(
                            (warning) => !warning.fixed
                          );

                        const isSelectedPolygon =
                          selectedPolygon?.id === poly.id;

                        return (
                          <tr
                            className={cn(
                              "border-t align-middle",
                              !isSelectedPolygon &&
                                "text-muted-foreground transition-all"
                            )}
                            key={poly.id}
                          >
                            <td className="py-1 px-2">
                              <Badge
                                variant={
                                  isSelectedPolygon ? "default" : "outline"
                                }
                                onClick={() => {
                                  !isSelectedPolygon
                                    ? handlePolygonSwitch(poly)
                                    : undefined;
                                }}
                              >
                                {isSelectedPolygon ? (
                                  <Icons.eye className="mr-2" />
                                ) : (
                                  <Icons.eyeOff className="mr-2" />
                                )}
                                {poly.source}
                              </Badge>
                            </td>
                            <td colSpan={4}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <div className="flex rounded-md hover:bg-white/80 transition-all">
                                    <div className="py-1 px-2 w-full">
                                      {poly.coordinates.length}
                                    </div>
                                    <div className="py-1 px-2 w-full">
                                      {pointsDistance.avg || 0}
                                    </div>
                                    <div className="py-1 px-2 w-full">
                                      {pointsDistance.max || 0}
                                    </div>
                                    <div className="py-1 px-2 w-full">
                                      {pointsDistance.min || 0}
                                    </div>
                                  </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="max-w-[100vw] max-h-[550px] p-6 overflow-auto"
                                >
                                  <pre>
                                    {poly.coordinates.map((point, index) => {
                                      return (
                                        <React.Fragment
                                          key={point.toString() + index}
                                        >
                                          <i>#{index + 1}</i>:{" "}
                                          {point.toString()}
                                          {index !==
                                            poly.coordinates.length - 1 && (
                                            <>
                                              <b>
                                                {"\n   ↑ "}
                                                {Math.round(
                                                  pointsDistance.distanceArr?.[
                                                    index
                                                  ] || 0
                                                )}
                                                {" meters ↓\n"}
                                              </b>
                                            </>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                  </pre>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                            <td className="py-1 px-2 flex flex-col gap-1">
                              {filteredWarnings.length ||
                              filteredInteractionWarnings.length ? (
                                <>
                                  {filteredWarnings.map((polyWarn) => (
                                    <span key={polyWarn.id}>
                                      {polyWarn.key}
                                    </span>
                                  ))}
                                  {filteredInteractionWarnings.length > 0 && (
                                    <span>Overlaps</span>
                                  )}
                                </>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="py-1 px-2">
                              {poly.active ? (
                                <div className="flex">
                                  {!displayDisalingButton && <Icons.check />}
                                  {displayDisalingButton && (
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        checked={selectedPolygon?.active}
                                        onCheckedChange={onSwitchChange}
                                        name="active"
                                        id="active"
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
                            </td>
                            <td className="py-1 px-2">
                              {
                                new Date(poly.createdAt)
                                  .toLocaleString()
                                  .split(" ")[0]
                              }
                              <br />
                              {
                                new Date(poly.createdAt)
                                  .toLocaleString()
                                  .split(" ")[1]
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="grid gap-3 my-4">
              <div className="font-semibold">Area</div>
              <ul className="grid gap-3 ml-1">
                {getLatestPolygonArea(selectedPolygon) !== NA_STRING && (
                  <>
                    <PrintKeyValue
                      label="Calculated area (ha)"
                      value={getLatestPolygonArea(selectedPolygon) + " ha"}
                    />
                    <PrintKeyValue
                      label="Calculated area (acr)"
                      value={
                        getLatestPolygonArea(selectedPolygon, true) + " acr"
                      }
                    />
                  </>
                )}
                <PrintKeyValue
                  label="Manually estimated area"
                  value={
                    plot.areaSizeManual > 0
                      ? plot.areaSizeManual?.toFixed(2) + " ha" ?? "-"
                      : "-"
                  }
                />
                <PrintKeyValue
                  label="Yield estimate"
                  value={plot.yieldEstimateRaw + " kg" ?? "n/a"}
                />
                <PrintKeyValue
                  label="Intercropped"
                  value={plot.interCropped ? "Intercropped" : "n/a"}
                />
              </ul>
            </div>

            <Separator className="my-2" />

            <div className="grid gap-3 mt-4">
              <div className="font-semibold">Tree counts</div>
              <ul className="grid gap-3 ml-1">
                <PrintKeyValue
                  label="Productive"
                  value={getTreeCounts(plot).productive}
                />
                <PrintKeyValue
                  label="Young"
                  value={getTreeCounts(plot).young}
                />
                <PrintKeyValue
                  label="Stumped"
                  value={getTreeCounts(plot).stumped}
                />
                <PrintKeyValue
                  label="Shade"
                  value={getTreeCounts(plot).shade}
                />
              </ul>
            </div>

            <Separator className="my-2" />

            <div className="grid gap-3 mt-4">
              <div className="font-semibold">Satellite</div>
              <ul>
                <PrintKeyValue
                  label={"Satellite analysis"}
                  value={latestSatellite?.status || "n/a"}
                />
              </ul>
              <ul>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground capitalize">
                    Re-do analysis
                  </span>
                  <span>
                    {" "}
                    {(!latestSatellite?.status ||
                      !latestSatellite?.parcelId) && (
                      <Button
                        className="text-xs"
                        onClick={() => {
                          requestSatelliteAnalysisMutation.mutate(farmId);
                        }}
                      >
                        Submit analysis request
                      </Button>
                    )}
                    {(latestSatellite?.status === "PENDING" || // Pending
                      latestSatellite?.landcoverForestCoverage === null) && // Old data version
                      latestSatellite?.parcelId && (
                        <Button
                          className="text-xs"
                          onClick={() => {
                            requestAnalysisResultMutation.mutate(plot.id);
                          }}
                        >
                          Get results {latestSatellite.parcelId}
                        </Button>
                      )}
                  </span>
                </li>
              </ul>
              <ul>
                {plot.polygons.length === 0 && (
                  <Badge className="text-xs" variant="outline">
                    N/A
                  </Badge>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
        <div className="">
          <GaugeChart
            title={
              "Deforestation risk: " +
              (latestSatellite?.deforestationRisk?.toUpperCase() || "")
            }
            subTitle={`Deforested area against 2020 maps & satellite`}
            summary={deforestationSummary}
            explanation={deforestationExplanation}
            chartData={[
              {
                month: "january",
                valueLeft: latestSatellite.deforestationAreaHa,
                valueRight:
                  latestSatellite.area - latestSatellite.deforestationAreaHa,
              },
            ]}
            className="w-full"
          />
          <GenericPieChart
            className="w-full"
            title="Landcover distribution"
            subTitle="Analysis from maps & satellite"
            chartData={plotAnalysisStatus}
            summaryType="disabled"
            summaryExplanationText="as % of landmass"
            footerContent={<div className="flex flex-col gap-2 text-sm"></div>}
          />
        </div>
      </div>
    </>
  );
}
