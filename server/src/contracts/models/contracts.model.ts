import { Contract as PrismaContract } from '.prisma/client';

//unfortunately we have 2 types in the DB now, this one is being used by GeoJson and the one under by us
export type ContractCoordinate = {
  lat: number;
  lng: number;
};

//we have been using this in the previous Orijin, need to convert
// export type LatLong = {
//   lat: number;
//   lon: number;
// };

// export enum ContractType {
//   Polygon = 'Polygon',
//   Point = 'Point',
// }

export type Coordinates = {
  coords: ContractCoordinate;
  altitude: number;
  accuracy: number;
  altitudeAccuracy: number;
  speed: number;
  altitudeMin: number;
  altitudeMax: number;
  name: string;
};

export type Contract = PrismaContract;
