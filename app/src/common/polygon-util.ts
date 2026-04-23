/* eslint-disable @typescript-eslint/no-unsafe-call */
import { MapData } from "@/components/map/utils/config/farm-map-config";
import type { Polygon } from "@/types/farm";
import type { Feature, FeatureCollection } from "@turf/turf";
import * as turf from "@turf/turf";
import { polygon } from "@turf/helpers";

export const makePolygonConcave = (
  polygon: Polygon,
  move?: number | undefined
) => {
  const points: Feature = polygon.coordinates.map((pair) => turf.point(pair));
  const featCollection: FeatureCollection = turf.featureCollection(
    points
  ) as FeatureCollection;
  let newGeojsonPolygon: Feature<Polygon> = turf.convex(featCollection);
  if (move) {
    newGeojsonPolygon = turf.transformTranslate(newGeojsonPolygon, 0.05, move);
  }
  console.log("newGeojsonPolygon", newGeojsonPolygon);
  return {
    ...polygon,
    coordinates: newGeojsonPolygon.geometry.coordinates[0],
  };
};
export const getPolygonsFromMapData = (mapData: MapData[]) => {
  const polygons: Polygon[] = [];
  const currentPlotForCheckingOverlap = mapData[0]?.polygons[0]?.plotId;

  mapData.forEach((item) => {
    item.polygons?.forEach((polygon) => {
      polygon.polygonInteractionWarnings?.forEach((warning) => {
        if (!warning.fixed) {
          warning.polygons?.forEach((polygon) => {
            polygons.push(polygon);
          });
        }
      });
    });
  });
  const uniquePolygonIds = new Set();
  const uniquePolygons: Polygon[] = [];
  let currentPolygonData = null;

  for (const polygon of polygons) {
    if (
      !uniquePolygonIds.has(polygon.id) &&
      polygon.plotId !== currentPlotForCheckingOverlap
    ) {
      uniquePolygonIds.add(polygon.id);
      uniquePolygons.push(polygon);
    } else if (
      polygon.plotId === currentPlotForCheckingOverlap &&
      !currentPolygonData
    ) {
      currentPolygonData = polygon;
    }
  }
  return {
    uniquePolygons,
    currentPolygonData,
  };
};

export const extractIntersectionAreaFromMapData = (mapData: MapData[]) => {
  const { uniquePolygons, currentPolygonData } =
    getPolygonsFromMapData(mapData);

  const intersections = [];
  const overlappingPolygons = [];
  const uniqueCount = uniquePolygons.length;
  if (uniqueCount > 0 && !!currentPolygonData) {
    const currentPolygon = polygon([currentPolygonData.coordinates]);
    for (const item of uniquePolygons) {
      const overlappingPoly = polygon([item?.coordinates]);
      overlappingPolygons.push(overlappingPoly);
      const intersectionData = turf.intersect(currentPolygon, overlappingPoly);
      if (intersectionData) {
        const overlappingArea = turf.area(intersectionData) * 0.0001;
        const areaCalculated = +(item?.areaCalculated || 1);
        const percent =
          ((overlappingArea / (areaCalculated || 1)) * 100).toFixed(2) + "%";

        intersectionData.properties.percent = percent;
        intersections.push(intersectionData);
      }
    }
  }
  return { intersections, overlappingPolygons: overlappingPolygons };
};
