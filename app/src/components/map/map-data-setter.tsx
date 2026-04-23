import { memo } from "react";
import { FarmMap } from "@/components/map/farm-map";
import { MapData } from "./utils/config/farm-map-config";
import {
  extractIntersectionAreaFromMapData,
  getPolygonsFromMapData,
} from "@/common/polygon-util";
import {
  createFarmFeatures,
  createPolygonFeatures,
  getPointFeatures,
} from "./utils/map/map-data-handlers";
import { getMarkerCoordinates } from "./utils/map/helpers";
import { Features } from "@/types/farm";

type MapDataSetterProps = {
  mapData: MapData[];
  isBigMap: boolean;
  selectedPlot?: string;
};

export const MapDataSetter = memo(
  ({ mapData, isBigMap, selectedPlot }: MapDataSetterProps) => {
    const isMultipleMaps = mapData.length > 1;

    const polygonFeatures = createPolygonFeatures(mapData);
    const { intersections, overlappingPolygons } =
      extractIntersectionAreaFromMapData(mapData);
    const markerCoordinates = getMarkerCoordinates(mapData);
    const { uniquePolygons } = getPolygonsFromMapData(mapData);

    const features: Features = {
      farmFeatures: isMultipleMaps
        ? createFarmFeatures(mapData)
        : getPointFeatures(mapData),
      polygonFeatures,
      intersections,
      overlappingPolygons,
      markers: isMultipleMaps ? [] : markerCoordinates,
      uniquePolygons,
    };

    return (
      <FarmMap
        features={features}
        isBigMap={isBigMap}
        selectedPlot={selectedPlot}
      />
    );
  }
);
