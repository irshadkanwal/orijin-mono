import { Injectable, Logger } from '@nestjs/common';
import * as turf from '@turf/turf';
import { PolygonWarning } from './dto/polygonUtil.dto';
import { Polygon } from '../geodatas/models/geodatas.model';
import { PolygonInteractionWarning } from '@prisma/client';
import { PlotCoordinateSources } from '../farms/models/plots.model';
import {
  HECTARE_TO_SQUARE_METER_MULTIPLIRE,
  SQUARE_METER_TO_HECTARES_MULTIPLIER,
} from '../common/constants';

const firstNotSameAsLast = (firstCoord, lastCoord) => {
  return firstCoord[0] !== lastCoord[0] || firstCoord[1] !== lastCoord[1];
};

const getMaxAllowedDistanceBetweenPoints = (polygonSource) => {
  return polygonSource === PlotCoordinateSources.ORIJIN_APP
    ? 12.5 // Our app should be very precise - IF CHANGING THIS, CHECK THE UNIT TEST'S VISUAL OUTPUT!!
    : 1000.0; // Imported data can be pretty much anything..
};

const haveWarn = (warningName: PolygonWarning['key'], polygonWarnings) => {
  return !!polygonWarnings.find((warn) => warn.key === warningName);
};

type InteractionWarnings = {
  createOverlapWarning?: boolean;
};

export type OverlapResults = {
  polygons: Polygon[];
  outdatedWarnings: PolygonInteractionWarning[];
};

export type GeoJSONPolygonInput = {
  properties: any;
  coordinates: number[][] | number[];
};

@Injectable()
export class PolygonUtilService {
  logger = new Logger(PolygonUtilService.name);

  // constructor(private readonly logger: Logger) {}

  convertToGeoJson(polygons: GeoJSONPolygonInput[], withPoint = true): any {
    return {
      type: 'FeatureCollection',
      features: polygons
        .map((polygon) => {
          const pointFeature = {
            type: 'Feature',
            properties: polygon.properties,
            geometry: {
              coordinates: polygon.coordinates[0],
              type: 'Point',
            },
            id: 0,
          };
          const polyFeature = {
            type: 'Feature',
            properties: polygon.properties,
            geometry: {
              coordinates: [polygon.coordinates],
              type: 'Polygon',
            },
          };
          return withPoint ? [pointFeature, polyFeature] : [polyFeature];
        })
        .filter((x) => x)
        .flat(),
    };
  }

  shiftPolygon(coordinates, howMuch = 0.0005) {
    // TODO: Determine shift need from coordinate boundaries or something..
    return coordinates.map((coord) => {
      return [coord[0] + howMuch, coord[1]];
    });
  }

  /**
   * Area in square meters
   *
   * @param geoJson
   */
  calculateArea(geoJson): number {
    // const polygon = turf.polygon([
    //   [
    //     [125, -15],
    //     [113, -22],
    //     [154, -27],
    //     [144, -15],
    //     [125, -15],
    //   ],
    // ]);

    const area = turf.area(geoJson);
    // console.log(area);
    return area;
  }

  selfIntersects(coordinates: number[][]) {
    return turf.kinks(turf.polygon([coordinates])).features.length > 0;
  }

  getPolygonInteractionWarnings(
    warningType: InteractionWarnings,
    polygonIdA: string,
    polygonIdB: string,
  ) {
    if (warningType?.createOverlapWarning) {
      return {
        key: 'Interaction-polygon-overlapping',
        fixed: false,
        polygons: {
          connect: [{ id: polygonIdA }, { id: polygonIdB }],
        },
      };
    }
  }

  checkDistanceBetweenPoints(coordinates: number[][], polygonSource: string) {
    const maxMetersBetweenPoints =
      getMaxAllowedDistanceBetweenPoints(polygonSource);

    for (let i = 0; i < coordinates.length; i++) {
      const nextPoint = coordinates[i === coordinates.length - 1 ? 0 : i + 1];
      const distanceToNextPoint = this.getDistanceBetweenCoordinates(
        coordinates[i],
        nextPoint,
      ).distance;
      if (distanceToNextPoint > maxMetersBetweenPoints) return true;
    }
  }

  isTooLarge(coordinates, plotCode) {
    const tooLargeInSquareMeters = 30 * HECTARE_TO_SQUARE_METER_MULTIPLIRE; // TODO: Make commodity-specific
    const area = turf.area(turf.polygon([coordinates]));
    const tooLarge = area > tooLargeInSquareMeters;
    if (tooLarge) {
      this.logger.warn(
        'Area too large for ' +
          plotCode +
          ': ' +
          area +
          ' m2, max allowed: ' +
          tooLargeInSquareMeters,
      );
    }
    return tooLarge;
  }

  isTooSmall(coordinates, plotCode) {
    const tooSmallInSquareMeters = 10;
    const area = turf.area(turf.polygon([coordinates]));
    const tooSmall = area < 10;
    if (tooSmall) {
      this.logger.warn(
        'Area too small for ' +
          plotCode +
          ': ' +
          area +
          ' m2, min allowed: ' +
          tooSmallInSquareMeters,
      );
    }
    return tooSmall;
  }

  completePolygonAndGetWarnings(
    coordinates: number[][],
    polygonSource: string,
    plotCode?: string,
  ): {
    completedPolygon: number[][];
    polygonWarnings: PolygonWarning[];
    areaAsSquareMeters?: number;
  } {
    // Just a single point - no need to verify further
    if (coordinates.length === 1) {
      return { completedPolygon: coordinates, polygonWarnings: [] };
    }

    const polygonWarnings: PolygonWarning[] = [];

    // First and last point are not equivalent - an obvious fix, not worth of even a warning
    const firstCoord = coordinates[0];
    const lastCoord = coordinates[coordinates.length - 1];
    if (firstNotSameAsLast(firstCoord, lastCoord)) {
      coordinates.push(coordinates[0]);
    }

    // Not enough points, can't proceed
    if (coordinates.length <= 3) {
      return {
        completedPolygon: null,
        polygonWarnings: [{ key: 'Not-enough-points', fixed: false }],
      };
    }

    // Distance too large
    if (this.checkDistanceBetweenPoints(coordinates, polygonSource)) {
      polygonWarnings.push({ key: 'Spikes', fixed: false });
    }

    // Self-intersects
    let areaAsSquareMeters = null;
    if (this.selfIntersects(coordinates)) {
      polygonWarnings.push({ key: 'Self-intersects', fixed: false });
    } else {
      // Only meaningful if not self-intersecting

      try {
        areaAsSquareMeters = turf.area(turf.polygon([coordinates]));
      } catch (error) {
        this.logger.error('Error while calculating area', error?.message);
      }

      if (this.isTooLarge(coordinates, plotCode)) {
        polygonWarnings.push({ key: 'Area-too-large', fixed: false });
      }

      if (this.isTooSmall(coordinates, plotCode)) {
        polygonWarnings.push({ key: 'Area-too-small', fixed: false });
      }
    }

    return {
      completedPolygon: coordinates,
      polygonWarnings,
      areaAsSquareMeters,
    };
  }

  fixPolygon(
    coordinates: number[][],
    originalWarnings: PolygonWarning[],
    polygonSource: string,
    plotShortCode: string,
  ) {
    // console.log(
    //   'Checking incoming polygon, GeoJSON: ',
    //   this.convertToGeoJson([{ coordinates }]),
    // );

    // Will never be able to fix
    if (
      haveWarn('Not-enough-points', originalWarnings) ||
      haveWarn('Distance-between-every-point-is-too-large', originalWarnings)
    ) {
      this.logger.warn(
        'Unfixable polygon due to warnings ' + JSON.stringify(originalWarnings),
      );
      return null;
    }

    // Able to fix
    const warningsAfterFixAttempt: PolygonWarning[] = [];
    let fixedCoordinates = [...coordinates]; // Copy to avoid modifying the original

    // Fix spikes
    if (haveWarn('Spikes', originalWarnings)) {
      fixedCoordinates = this.fixSpikes(fixedCoordinates, polygonSource);
      if (fixedCoordinates.length <= 3) {
        this.logger.warn(
          'Unfixable polygon due to spikes for ' + plotShortCode,
        );
        return null;
      }
      warningsAfterFixAttempt.push({ key: 'Spikes', fixed: true });
    }

    // Fix self-intersects - if had warning AND still self-intersects after spike fix
    if (haveWarn('Self-intersects', originalWarnings)) {
      const stillIntersects = this.selfIntersects(fixedCoordinates);
      if (!stillIntersects) {
        // Fixed as side effect of earlier fixes
        warningsAfterFixAttempt.push({ key: 'Self-intersects', fixed: true });
      } else {
        // const intersectionFixedCoords = this.fixSelfIntersectsWithRightHandSide(
        const intersectionFixedCoords = this.fixSelfIntersectWithConcave(
          fixedCoordinates,
          plotShortCode,
        );
        if (intersectionFixedCoords) {
          fixedCoordinates = intersectionFixedCoords;
          warningsAfterFixAttempt.push({ key: 'Self-intersects', fixed: true });
        } else {
          warningsAfterFixAttempt.push({
            key: 'Self-intersects',
            fixed: false,
          });
        }
      }
    }

    // const remainingWarnings: PolygonWarning[] =
    //   this.completePolygonAndGetWarnings(fixedCoordinates, polygonSource);

    const areaAsSquareMetersAfterFix = turf.area(
      turf.polygon([fixedCoordinates]),
    );

    const isTooLargeAfterFixing = this.isTooLarge(
      fixedCoordinates,
      plotShortCode,
    );
    if (isTooLargeAfterFixing) {
      warningsAfterFixAttempt.push({ key: 'Area-too-large', fixed: false });
      return null;
    } else if (haveWarn('Area-too-large', originalWarnings)) {
      this.logger.log(
        'Not too large after fixing: ' +
          areaAsSquareMetersAfterFix +
          ' but had earlier warning in ',
        originalWarnings,
      );
      warningsAfterFixAttempt.push({ key: 'Area-too-large', fixed: true });
    }

    if (this.isTooSmall(fixedCoordinates, plotShortCode)) {
      warningsAfterFixAttempt.push({ key: 'Area-too-small', fixed: false });
      return null;
    }

    return {
      warningsAfterFixAttempt: warningsAfterFixAttempt,
      fixedCoordinates: fixedCoordinates,
      areaAsSquareMetersAfterFix: areaAsSquareMetersAfterFix,
    };
  }

  checkPolygonOverlappingForOrg(
    polygons: Polygon[],
    coordinates: number[][],
    polygonId: string,
  ): OverlapResults | null {
    if (!coordinates?.length || !polygons?.length || coordinates.length === 1) {
      return null;
    }

    const newPolygon = this.createPolygon([coordinates]);

    const overlappingPolygons = [];
    const outdatedWarnings = [];
    polygons.forEach((otherPolygon) => {
      const targetPolygon = this.createPolygon([otherPolygon.coordinates]);
      const existingInteractionWarnings =
        otherPolygon.polygonInteractionWarnings;

      if (polygonId !== otherPolygon.id) {
        try {
          const isOverlapping = this.isPolygonOverlapping(
            newPolygon,
            targetPolygon,
          );
          if (isOverlapping) {
            overlappingPolygons.push(otherPolygon);
          }
        } catch (error) {
          this.logger.error(
            'Error while checking for overlap: ' + error?.message,
          );
          // this.logger.error({ coordinates, otherPolygon });
        }

        existingInteractionWarnings.forEach((warning) => {
          if (
            warning['polygons'].map((polygon) => polygon.id).includes(polygonId)
          ) {
            outdatedWarnings.push(warning);
          }
        });
      }
    });

    return {
      polygons: overlappingPolygons,
      outdatedWarnings,
    };
  }

  fixSpikes(originalPolygon: number[][], polygonSource) {
    const polygon = [...originalPolygon];

    // If polygon has been closed by pushing first point to the end too, remove the last point to
    // avoid inaccurate first point guiding the simplification
    const first = polygon[0];
    const last = polygon[polygon.length - 1];
    if (first[0] === last[0] && first[1] === last[1]) {
      polygon.pop();
    }

    // Accuracy often improves towards the end, so travel from last point to first for better results
    const polygonReversed = [...polygon].reverse();

    const maxMetersBetweenPoints =
      getMaxAllowedDistanceBetweenPoints(polygonSource);
    const simplified = [polygonReversed[0]]; // Always keep the last point

    for (let i = 0; i < polygonReversed.length - 1; ) {
      const currentPoint = simplified[simplified.length - 1];
      let nextPointIndex = i + 1;
      let foundClosePoint = false;
      while (nextPointIndex < polygonReversed.length) {
        const nextPoint = polygonReversed[nextPointIndex];
        const distance = this.getDistanceBetweenCoordinates(
          currentPoint,
          nextPoint,
        );
        if (distance.distance <= maxMetersBetweenPoints) {
          simplified.push(nextPoint);
          i = nextPointIndex;
          foundClosePoint = true;
          break;
        }
        nextPointIndex++;
      }

      if (!foundClosePoint) {
        break; // No more close points found, end the loop
      }
    }

    simplified.reverse(); // Back to original order
    simplified.push(simplified[0]); // Close the polygon
    return simplified;
  }

  /**
   * DISABLED as this distorts the original polygon too much now.
   *
   * TODO: try with Turf.buffer and play with tolerances etc.
   *
   * @param coordinates
   */
  fixSelfIntersectWithSimplify(coordinates: number[][]) {
    const polygon = turf.polygon([coordinates]);
    const fixedCoordinates: number[][] = fix(polygon, 0.1);

    function fix(pol: any, tolerance: number) {
      const fixPolygon = turf.simplify(pol, {
        tolerance: tolerance,
        highQuality: true,
      });
      const isKink = turf.kinks(fixPolygon).features.length;

      if (isKink && turf.round(tolerance, 1) < 1) {
        return fix(pol, turf.round(tolerance + 0.1, 1));
      } else return fixPolygon.geometry.coordinates[0];
    }

    return fixedCoordinates.length ? fixedCoordinates : coordinates;
  }

  fixSelfIntersectsWithRightHandSide(polygon, plotShortCode) {
    if (!polygon || !Array.isArray(polygon) || polygon.length <= 1) {
      return polygon;
    }

    // Helper function to calculate centroid
    function calculateCentroid(coords) {
      const n = coords.length;
      let sumX = 0;
      let sumY = 0;
      for (const [x, y] of coords) {
        sumX += x;
        sumY += y;
      }
      return [sumX / n, sumY / n];
    }

    // Get the coordinates of the polygon
    const coords = polygon.slice(0, -1); // Exclude the closing point (same as the first point)

    // Calculate the centroid
    const centroid = calculateCentroid(coords);

    // Reference vector pointing up
    const refVec = [0, 1];

    // Function to calculate the angle and distance
    function clockwiseAngleAndDistance(point) {
      const vector = [point[0] - centroid[0], point[1] - centroid[1]];
      const lenVector = Math.hypot(vector[0], vector[1]);
      if (lenVector === 0) {
        return [-Math.PI, 0];
      }
      const normalized = [vector[0] / lenVector, vector[1] / lenVector];
      const dotProd = normalized[0] * refVec[0] + normalized[1] * refVec[1];
      const diffProd = refVec[1] * normalized[0] - refVec[0] * normalized[1];
      let angle = Math.atan2(diffProd, dotProd);
      if (angle < 0) {
        angle = 2 * Math.PI + angle;
      }
      return [angle, lenVector];
    }

    // Sort the coordinates
    const sortedCoords = coords.sort((a, b) => {
      const [angleA] = clockwiseAngleAndDistance(a);
      const [angleB] = clockwiseAngleAndDistance(b);
      return angleA - angleB;
    });

    // Create a new polygon with sorted coordinates
    return [...sortedCoords, sortedCoords[0]];
  }

  fixSelfIntersectWithConcave(
    originalCoordinates: number[][],
    plotShortCode: string,
  ) {
    function fix(pol: any) {
      const fixPolygon = turf.concave(pol);
      return fixPolygon.geometry.coordinates[0] as number[][];
    }
    const coordinatesAsPoints = turf.featureCollection(
      originalCoordinates.map((coord) => turf.point(coord)),
    );
    try {
      const fixedCoordinates: number[][] = fix(coordinatesAsPoints);
      return fixedCoordinates.length ? fixedCoordinates : null;
    } catch (err) {
      this.logger.warn(
        'Failed self-intersection fix with concave for ' +
          plotShortCode +
          ', err: ' +
          err,
      );
      this.logger.warn(
        this.convertToGeoJson([
          { coordinates: originalCoordinates, properties: {} },
        ]),
      );
      return null;
    }
  }

  getDistanceBetweenCoordinates(coordinate1: number[], coordinate2: number[]) {
    const point1 = turf.point(coordinate1);
    const point2 = turf.point(coordinate2);
    const distance = turf.distance(point1, point2, { units: 'meters' });
    return {
      distance: distance,
      points: [point1, point2],
    };
  }

  createPolygon(coordinates) {
    if (coordinates.length === 1) {
      return coordinates;
    }
    return turf.polygon(coordinates);
  }

  isPolygonOverlapping(polygonSource, polygonTarget): boolean {
    // sometimes throws error if data is like [ [ [ 30.1731571, 0.858141 ] ] ]
    try {
      return turf.booleanOverlap(
        { type: 'Polygon', coordinates: polygonSource },
        { type: 'Polygon', coordinates: polygonTarget },
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
