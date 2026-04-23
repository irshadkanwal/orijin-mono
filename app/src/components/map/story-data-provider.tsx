import mapboxgl, {
  MapboxGeoJSONFeature,
  type Map,
  type MapMouseEvent,
} from "mapbox-gl";
import FarmMap from "./farm-map-story";
import { Coordinates, Polygon } from "@/types/farm";
import { MapData } from "./utils/config/farm-map-config";
import * as turf from "@turf/turf";
import React, { useState } from "react";

interface StoryDataProviderProps {
  mapData: MapData[];
}

export type Features = {
  farmFeatures: GeoJSON.Feature[];
  polygonFeatures: GeoJSON.Feature[];
  markerCordinates: Coordinates[];
};

export const unclusterZoomCutoff = 12;

export const DATA = {
  POINTS: "points",
  LINES: "lines",
};

export const LAYERS = {
  LINES_FILL: "lines-fill",
  LINES_OUTLINE: "lines-outline",
  CLUSTERS: "clusters",
  CLUSTERS_WITH_COUNT: "cluster-count",
  UNCLUSTERED_POINT: "unclustered-point",
};

function hasValidCoordinates(coordinates?: Coordinates): boolean {
  return !!coordinates && coordinates.length > 0;
}

function getValidPolygonCoordinate(
  farm: MapData
): [number, number] | undefined {
  for (const polygon of farm.polygons) {
    if (hasValidCoordinates(...polygon.coordinates)) {
      return polygon.coordinates[0];
    }
  }

  return undefined;
}

function getValidCoordinate(farm: MapData): Coordinates | undefined {
  const isTrue =
    farm.facility.coordinate && hasValidCoordinates(farm.facility.coordinate);

  if (isTrue) {
    return farm.facility.coordinate;
  }

  for (const polygon of farm.polygons) {
    if (hasValidCoordinates(...polygon.coordinates)) {
      return polygon.coordinates[0];
    }
  }

  return undefined;
}

function getMarkerCoordinates(mapData: MapData[]): Coordinates[] {
  return mapData
    .flatMap((farm) =>
      farm.polygons
        .filter((polygon) => polygon.coordinates.length === 1)
        .map((polygon) => polygon.coordinates[0])
    )
    .filter((featrue) => featrue !== undefined);
}

export function getPointFeatures(mapData: MapData[]): GeoJSON.Feature[] {
  return mapData
    .flatMap((farm) =>
      farm.polygons.map((polygon) => {
        const pointCoordinates = getValidPolygonCoordinate(farm);

        if (!pointCoordinates) return null;
        return {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: pointCoordinates,
          },
          properties: {
            id: farm.id,
            plotId: farm.plots[0]?.shortCode,
            farmShortCode: farm.facility.shortCode,
            facilityName: farm.facility.name,
          },
        };
      })
    )
    .filter((feature) => feature !== null);
}

function createFarmFeature(mapData: MapData[]): GeoJSON.Feature[] {
  return mapData
    .map((farm, index: number) => {
      const pointCoordinates = getValidCoordinate(farm);

      if (!pointCoordinates) return null;
      return {
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: pointCoordinates.flat(),
        },
        properties: {
          id: farm.id,
          plotId: farm.plots[0]?.shortCode,
          farmShortCode: farm.facility.shortCode,
          facilityName: farm.facility.name,
        },
      };
    })
    .filter((feature) => feature !== null);
}

function createPolygonFeatures(mapData: MapData[]): GeoJSON.Feature[] {
  return mapData.flatMap((farm) =>
    farm.polygons.map((polygon, index: number) => {
      let coordinates;
      let isCircle;
      if (polygon.coordinates.length === 1) {
        isCircle = true;
        const pointCoord = polygon.coordinates[0]!;
        const radius = 2;

        const circle = turf.circle(pointCoord, radius);

        const roundedCircleCoordinates = circle.geometry.coordinates[0].map(
          ([lng, lat]: [number, number]) => [
            turf.round(lng, 6),
            turf.round(lat, 6),
          ]
        );
        coordinates = [roundedCircleCoordinates];
      } else {
        coordinates = [polygon.coordinates];
      }
      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: coordinates,
        },
        properties: {
          index,
          id: farm.id,
          plot: farm.plots[0]?.shortCode,
          plotId: polygon.plotId,
          farmShortCode: farm.facility.shortCode,
          facilityName: farm.facility.name,
          shapeType: isCircle ? "singlePoint" : "polygon",
        },
      };
    })
  );
}

function setBoundsFromCoordinates(
  bounds: mapboxgl.LngLatBounds,
  coordinates: number[][]
) {
  coordinates
    .filter((coords) => coords && coords.length > 0)
    .forEach((coord) => {
      bounds.extend(coord as mapboxgl.LngLatLike);
    });
}

export const scaleMapToContents = (map: Map, data: any) => {
  const fitBoundsOptions = { padding: 20 };
  const bounds = new mapboxgl.LngLatBounds();
  let coordinates: GeoJSON.Position[];

  if (data.polygonFeatures) {
    coordinates = data.polygonFeatures.flatMap((polygon: any) => {
      if (polygon.geometry.type === "Polygon") {
        return polygon.geometry.coordinates.flat();
      }
      return [];
    });
  } else {
    coordinates = data.flatMap((polygon: any) => {
      if (polygon.geometry.type === "Polygon") {
        return polygon.geometry.coordinates.flat();
      }
      return [];
    });
  }

  if (coordinates.length > 0) {
    setBoundsFromCoordinates(bounds, coordinates);
    if (coordinates.length === 1) {
      map.fitBounds(bounds, fitBoundsOptions);
    } else {
      map.fitBounds(bounds, fitBoundsOptions);
    }
  }
};

export const defineVisibilityFromZoom = (map: Map) => {
  const zoom = map.getZoom();
  if (zoom >= unclusterZoomCutoff) {
    // Enable
    map.setPaintProperty(LAYERS.LINES_FILL, "fill-opacity", 0.5);
    map.setPaintProperty(LAYERS.LINES_OUTLINE, "line-opacity", 1);
    // Disable
    map.setPaintProperty(LAYERS.CLUSTERS, "circle-opacity", 0);
    map.setPaintProperty(LAYERS.CLUSTERS_WITH_COUNT, "text-opacity", 0);
  } else {
    // Enable
    map.setPaintProperty(LAYERS.CLUSTERS, "circle-opacity", 1);
    map.setPaintProperty(LAYERS.CLUSTERS_WITH_COUNT, "text-opacity", 1);
    // Disable
    map.setPaintProperty(LAYERS.LINES_FILL, "fill-opacity", 0);
    map.setPaintProperty(LAYERS.LINES_OUTLINE, "line-opacity", 0);
  }
};

export const displayPlotData = (
  e: MapMouseEvent & { features?: MapboxGeoJSONFeature[] | any[] },
  setSelectedPolygon: React.Dispatch<React.SetStateAction<Polygon | null>>,
  map: Map
) => {
  const props = e.features && e.features[0]?.properties;

  if (props) {
    setSelectedPolygon(props);
    map.setPaintProperty(LAYERS.LINES_FILL, "fill-color", [
      "case",
      ["==", ["get", "plotId"], props.plotId],
      "#11b4da",
      ["==", ["get", "shapeType"], "singlePoint"],
      "#f0484b",
      "#888888",
    ]);
    map.setPaintProperty(LAYERS.UNCLUSTERED_POINT, "circle-color", [
      "case",
      ["==", ["get", "plotId"], props.plotId],
      "#11b4da",
      ["==", ["get", "shapeType"], "singlePoint"],
      "#f0484b",
      "#888888",
    ]);
  }
};

const StoryDataProvider = ({ mapData }: StoryDataProviderProps) => {
  const [isSinglePlot, setIsSinglePlot] = useState<boolean>(false);
  const [isSinglePlotId, setIsSinglePlotId] = useState<string>("");

  let mapDataFarms;
  if (isSinglePlot) {
    mapDataFarms = mapData.filter((data) => data.id === isSinglePlotId);
  } else {
    mapDataFarms = mapData;
  }

  const farmFeatures = isSinglePlot
    ? getPointFeatures(mapDataFarms)
    : createFarmFeature(mapDataFarms);
  const polygonFeatures = createPolygonFeatures(mapDataFarms);
  const markerCordinates = getMarkerCoordinates(mapDataFarms);

  const Features: Features = {
    farmFeatures,
    polygonFeatures,
    markerCordinates,
  };

  return (
    <FarmMap
      features={Features}
      setIsSinglePlotId={setIsSinglePlotId}
      setIsSinglePlot={setIsSinglePlot}
    ></FarmMap>
  );
};

export default StoryDataProvider;
