import { Card, CardContent } from "@/components/ui/card.tsx";
import { useState } from "react";
import type { Farm, Plot, Polygon } from "@/types/farm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { SinglePlot } from "@/components/farms/single-plot.tsx";
import {
  transformFarmData,
  filterPlots,
  formatPlotShortCode,
} from "./utils/utils";
import { MapDataSetter } from "@/components/map/map-data-setter";

type FarmPlotsProps = {
  plots: Plot[];
  farmId: string;
  farmCoordinates: { latitude: string; longitude: string };
  farm: Farm;
};

export function FarmPlots({
  plots,
  farmId,
  farmCoordinates,
  farm,
}: FarmPlotsProps): JSX.Element {
  // For some reason, if having a ~150 point polygon, without initializing it here it won't display as the Map has rendered before the points are procssed..?
  const activePolygon = plots[0]?.polygons.find((poly) => poly.active);
  const initials =
    plots.length === 1
      ? {
          initialPlot: plots[0]?.id || "",
          initialPolygon: activePolygon || null,
        }
      : { initialPlot: "all", initialPolygon: null };

  const [selectedPlotId, setSelectedPlotId] = useState<string>(
    initials.initialPlot
  );
  const [selectedPolygon, setSelectedPolygon] = useState<Polygon | null>(
    initials.initialPolygon
  );

  const handleTabChange = (plotId: string) => {
    setSelectedPlotId(plotId);
  };

  const handlePolygonChange = (polygon: Polygon) => {
    setSelectedPolygon(polygon);
  };

  const polygonsForMap =
    selectedPlotId === "all"
      ? filterPlots(plots, "all")
      : selectedPolygon
        ? [selectedPolygon]
        : [];

  const mapData = transformFarmData(
    farm,
    farmCoordinates,
    farmId,
    polygonsForMap
  );

  const showMap = farmCoordinates || polygonsForMap?.length > 0;
  const isPluralPlots = plots.length > 1 ? "all" : plots[0]?.id;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="my-4 col-span-4">
        {showMap && mapData ? (
          <>
            <MapDataSetter
              mapData={[mapData]}
              isBigMap={false}
              selectedPlot={selectedPlotId}
            />
          </>
        ) : (
          <CardContent className="p-3 m-3">
            No polygons added yet, or polygon not usable!
          </CardContent>
        )}
      </Card>

      {plots.length > 0 && (
        <Tabs
          defaultValue={isPluralPlots}
          className="my-4 col-span-4"
          onValueChange={handleTabChange}
        >
          <TabsList className="flex-wrap  my-4 h-auto gap-2">
            {isPluralPlots === "all" && (
              <TabsTrigger value="all" className="hover:bg-background ">
                All Plots
              </TabsTrigger>
            )}
            {plots.map((plot, key) => {
              return (
                <TabsTrigger
                  value={plot.id}
                  key={key}
                  className="hover:bg-background"
                >
                  {formatPlotShortCode(plot)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {plots.map((plot, key) => {
            return (
              <TabsContent value={plot.id} key={key}>
                <SinglePlot
                  plot={plot}
                  farmId={farmId}
                  selectedPolygon={selectedPolygon || plot.polygons[0]}
                  onPolygonChange={handlePolygonChange}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
