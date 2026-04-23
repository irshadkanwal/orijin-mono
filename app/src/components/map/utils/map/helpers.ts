import { Coordinates } from "@/types/farm";
import { MapData } from "../config/farm-map-config";

function hasValidCoordinates(coordinates?: [number, number]): boolean {
  return !!coordinates && coordinates.length > 0;
}

function getValidCoordinate(farm: MapData): [number, number] | undefined {
  if (
    farm.facility.coordinate &&
    hasValidCoordinates(farm.facility.coordinate)
  ) {
    return farm.facility.coordinate;
  }

  for (const polygon of farm.polygons) {
    if (hasValidCoordinates(...polygon.coordinates)) {
      return polygon.coordinates[0];
    }
  }

  return undefined;
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

function isValidPolygonWithSinglePoint(mapData: MapData[]): boolean {
  return !!(
    mapData[0] &&
    mapData[0].polygons.length > 0 &&
    mapData[0].polygons[0] &&
    mapData[0].polygons[0].coordinates.length <= 2
  );
}

function getMarkerCoordinates(
  mapData: MapData[],
  isBigMap: boolean = false
): Coordinates[] {
  const coordinates: [number, number][] = [];
  if (!isBigMap) {
    mapData.forEach((farm) => {
      const filteredPolygons = farm.polygons.filter(
        (polygon) => polygon.coordinates.length === 1
      );
      filteredPolygons.forEach((polygon) => {
        coordinates.push(polygon.coordinates[0]!);
      });
    });
  } else {
    const facilityCoordinate = mapData[0]?.facility.coordinate;
    if (facilityCoordinate) {
      coordinates.push(facilityCoordinate);
    } else {
      mapData.forEach((farm) => {
        farm.polygons.forEach((polygon) => {
          if (polygon.coordinates.length === 1) {
            coordinates.push(polygon.coordinates[0]!);
          }
        });
      });
    }
  }

  return coordinates;
}

function ensurePolygonIsClosed(coordinates: Coordinates[]): Coordinates[] {
  // Ensure the polygon is closed (first and last coordinate should be the same)
  if (
    coordinates.length > 0 &&
    coordinates[0] !== coordinates[coordinates.length - 1]
  ) {
    coordinates.push(coordinates[0]!);
  }
  return coordinates;
}

export {
  ensurePolygonIsClosed,
  getMarkerCoordinates,
  hasValidCoordinates,
  isValidPolygonWithSinglePoint,
  getValidCoordinate,
  getValidPolygonCoordinate,
};
