import { Location as PrismaType, Plot as PrismaPlotType } from '.prisma/client';

export enum LocationMainType {
  GLOBAL = 'GLOBAL', // A global location based on an official address (like a certain city)
  CUSTOM = 'CUSTOM', // A custom organisation-specific location
}

export enum LocationLevels {
  DISTRICT = 'District',
  PARISH = 'Parish',
  VILLAGE = 'Village',
  SUB_COUNTY = 'SubCounty',
}

export enum MhCustomLocationLevels {
  REGION = 'Region',
  ZONE = 'Zone',
  FARMER_GROUP = 'Farmergroups',
}

export enum LTCCustomLocationLevels {
  COLLECTIONPOINT = 'CollectionPoint',
}

export const GlobalLocationTypeOrder = {
  [LocationLevels.DISTRICT]: 1,
  [LocationLevels.SUB_COUNTY]: 2,
  [LocationLevels.PARISH]: 3,
  [LocationLevels.VILLAGE]: 4,
};

export const CustomTypeOrder = {
  [MhCustomLocationLevels.FARMER_GROUP]: 1,
  [MhCustomLocationLevels.ZONE]: 2,
  [MhCustomLocationLevels.REGION]: 3,
};

export const LocationTypeOrder = {
  [LocationMainType.GLOBAL]: 1,
  [LocationMainType.CUSTOM]: 2,
};

export type Address = {
  street?: string;
  postalCode?: string;
  text?: string;

  // Everything below this most likely stored to Locations, not as detailed address
  city?: string;
  state?: string;
  region?: string;
  municipality?: string;
  district?: string;
  subCounty?: string;
  parish?: string;
  village?: string;
  countryCode?: string;
  country?: string;
};

export interface Location extends PrismaType {
  parent?: Location;
}
