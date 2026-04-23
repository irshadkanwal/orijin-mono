import { Polygon as PrismaGeoPolygon } from '@prisma/client';
import { PolygonInteractionWarning, PolygonWarning } from '@prisma/client';

export type Coordinates = {
  lat: number;
  lng: number;
  name?: string;
  altitude?: number;
  accuracy?: number;
  altitudeAccuracy?: number;
  speed?: number;
  altitudeMin?: number;
  altitudeMax?: number;
};

export type PrismaPolygon = PrismaGeoPolygon;

export type Polygon = PrismaPolygon & {
  polygonWarnings?: PolygonWarning[];
  polygonInteractionWarnings?: PolygonInteractionWarning[];
};
