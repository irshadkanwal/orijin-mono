import type {
  Map,
  GeoJSONSource,
  MapMouseEvent,
  MapboxGeoJSONFeature,
} from "mapbox-gl";
// eslint-disable-next-line no-duplicate-imports
import mapboxgl from "mapbox-gl";
import { type MapData, DATA, LAYERS } from "../config/farm-map-config";
import type { Features, Polygon } from "@/types/farm";
import {
  ensurePolygonIsClosed,
  getValidCoordinate,
  getValidPolygonCoordinate,
} from "./helpers";
import * as turf from "@turf/turf";

export const mapMarkers: { [key: string]: mapboxgl.Marker[] } = {
  bigMap: [],
  smallMap: [],
};

export function updateMapMarkers(
  map: Map,
  markerCoordinates: [number, number][],
  mapType: "bigMap" | "smallMap"
) {
  mapMarkers[mapType]?.forEach((marker) => marker.remove());

  markerCoordinates.forEach((coords) => {
    if (coords) {
      const marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
      mapMarkers[mapType]?.push(marker);
    }
  });
}

export function createFarmFeatures(farms: MapData[]): GeoJSON.Feature[] {
  return farms
    .map((farm) => {
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
          plotId: farm.polygons[0]?.plotId || `farm${farm.id}`,
          facilityName: farm.facility.name,
          farmShortCode: farm.facility.shortCode,
          areaCalculated:
            farm.plots.reduce(
              (acc, plot) => (acc += plot.areaSizeManual!),
              0
            ) || 0,
          plotShortCode: farm.facility.shortCode,
          updatedBy: farm.updatedBy,
          updatedAt: farm.updatedAt,
        },
      };
    })
    .filter((feature) => feature !== null);
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
            plotId: polygon.plotId || `farm${farm.id}`,
            facilityName: farm.facility.name,
            farmShortCode: farm.facility.shortCode,
            areaCalculated: polygon.areaManual || 0,
            plotShortCode: farm.facility.shortCode,
            updatedBy: farm.updatedBy,
            updatedAt: farm.updatedAt,
          },
        };
      })
    )
    .filter((feature) => feature !== null);
}

export function createPolygonFeatures(farms: MapData[]): GeoJSON.Feature[] {
  return farms.flatMap((farm) =>
    farm.polygons.map((polygon) => {
      let coordinates: [number, number][] = [];
      let isCircle = false;
      const plots = farm.plots?.find((plot) => plot.id === polygon.plotId);

      if (polygon.coordinates.length === 1) {
        isCircle = true;
        const pointCoord = polygon.coordinates[0]!;
        const radius = plots?.areaSizeManual ?? 0.2;

        const circle = turf.circle(pointCoord, radius);

        const roundedCircleCoordinates = circle.geometry.coordinates[0].map(
          ([lng, lat]: [number, number]) => [
            turf.round(lng, 6),
            turf.round(lat, 6),
          ]
        );

        coordinates = ensurePolygonIsClosed(roundedCircleCoordinates);
      } else {
        coordinates = ensurePolygonIsClosed(polygon.coordinates);
      }
      return {
        type: "Feature" as const,
        geometry: {
          type: "Polygon" as const,
          coordinates: [coordinates],
        },
        properties: {
          id: farm.id,
          plotId: polygon.plotId,
          facilityName: farm.facility.name,
          farmShortCode: farm.facility.shortCode,
          areaCalculated: polygon.areaCalculated,
          plotShortCode: polygon.plotShortCode,
          updatedBy: farm.updatedBy,
          updatedAt: farm.updatedAt,
          shapeType: isCircle ? "circle" : "polygon",
        },
      };
    })
  );
}

export function addDataToMap(
  map: Map,
  features: Features,
  isBigMap: boolean
): void {
  if (map.getSource(DATA.POINTS)) {
    (map.getSource(DATA.POINTS) as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: features.farmFeatures,
    });
  }

  if (map.getSource(DATA.LINES)) {
    (map.getSource(DATA.LINES) as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: features.polygonFeatures,
    });
  }

  if (map.getSource(DATA.INTERSECTION)) {
    (map.getSource(DATA.INTERSECTION) as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: features.intersections,
    });
    (map.getSource(DATA.OVERLAPPING) as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: features.overlappingPolygons,
    });
  }
  updateMapMarkers(map, features.markers, isBigMap ? "bigMap" : "smallMap");
}

export const setPolygonCardData = (
  e: MapMouseEvent & { features?: MapboxGeoJSONFeature[] | any[] },
  handlePolygonSelect: (polygon: Polygon) => void,
  map: Map
) => {
  const props = e.features && e.features[0]?.properties;
  if (props) {
    handlePolygonSelect(props);
    map.setLayoutProperty(LAYERS.OVERLAPPING_POLYGONS, "visibility", "visible");
    map.setPaintProperty(LAYERS.LINES_FILL, "fill-color", [
      "case",
      ["==", ["get", "plotId"], props.plotId],
      "#11b4da",
      ["==", ["get", "shapeType"], "circle"],
      "#f0484b",
      "#888888",
    ]);
    map.setPaintProperty(LAYERS.UNCLUSTERED_POINT, "circle-color", [
      "case",
      ["==", ["get", "plotId"], props.plotId],
      "#11b4da",
      "#888888",
    ]);
  }
};
