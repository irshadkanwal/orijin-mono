import type {
  CountItem,
  Farm as NestFarm,
} from "@orijin-server/farms/models/farms.model.ts";
import type { Person as NestPerson } from "@orijin-server/persons/models/persons.model.ts";
import type { Facility as NestFacility } from "@orijin-server/facilities/models/facility.model.ts";

export type Coordinates = [number, number];

export type PolygonForMap = Pick<Polygon, "id", "coordinates">;

export type PolygonInteractionWarning = {
  id: string;
  key: string;
  fixed: boolean;
  polygons: Polygon[];
};

export type PolygonWarning = {
  id: string;
  key: string;
  fixed: boolean;
  polygonId: string;
};

export type Polygon = {
  id: string;
  shortCode: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  active: boolean;
  status: string | null;
  areaCalculated: number | null;
  areaManual: number | null;
  coordinates: Coordinates[];
  source: string;
  plotId: string;
  plot: Plot;
  polygonWarnings: PolygonWarning[];
  polygonInteractionWarnings: PolygonInteractionWarning[];

  // Used in the map
  farmId?: string;
  farmShortCode?: string;
  facilityName?: string;
  plotShortCode?: string;

  // From Changelog via Farms
  updatedAt?: string;
  updatedBy?: string;
};

export type Plot = {
  id: string;
  shortCode: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  firestoreId: string | null;
  type: string;
  name: string;
  status: string | null;
  farmId: string;
  certificationStatus: string | null;
  interCropped: string | null;
  active: boolean | null;
  yieldEstimateRaw: number | null;
  yieldEstimateProcessed: number | null;
  cultivationStartDate: string | null;
  registrationDate: string | null;
  lastChemicalUseDate: string | null;
  principalOwnsLand: boolean | null;
  principalLeasesLand: boolean | null;
  hasRightToLand: boolean | null;
  hasLandTitle: boolean | null;
  ownerName: string | null;
  establishedBefore2020: boolean | null;
  hasShadeTrees: boolean | null;
  distanceToForestKnown: boolean | null;
  distanceToForest: number | null;
  traditionalOwners: boolean | null;
  traditionalOwnersPresent: boolean | null;
  areaSizeManual: number | null;
  areaSizeOrganicManual: number | null;
  polygons: Polygon[];
  satelliteAnalysis: SatelliteAnalysis[];
  plotCountItems: CountItem[];
};

export type Parent = {
  id: string;
  shortCode: string;
  organisation: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  type: string;
  name: string;
  coordinateId: string | null;
  parentId: string | null;
  parent: Parent | null;
};

export type Facility = NestFacility;
// export type Facility = {
//  id: string
//  shortCode: string
//  organisation: string
//  firestoreId: string | null
//  createdAt: string
//  updatedAt: string
//  deletedAt: string | null
//  name: string
//  type: string
//  areaTotalManual: string
//  address: string | null
//  locationId: string
//  coordinateId: string | null
//  mainContactPersonId: string | null
//  timezone: string | null
//  location: Location
//  mainContactPerson: Person
// }

export type Person = NestPerson & {
  name?: string;
  formattedData?: string;
};
//
// export type Person = {
//  id: string,
//  createdAt: Date,
//  updatedAt: Date,
//  deletedAt: Date,
//  customFields: string;
//  organisation: string;
//  shortCode: string;
//  type: UserType | string;
//  email: string;
//  phone: string;
//  phone2: string;
//  firstName: string;
//  middleName: string;
//  lastName: string;
//  nickName: string;
//  gender: Gender | string;
//  dateOfBirth: Date;
//  dateOfBirthApproximate: boolean;
//  identificationNumber: string;
//  identificationNumberType: string;
//  education: string;
//  maritalStatus: string;
//  // houseHoldMemberCount: string;
// }

export type Farm = NestFarm;

// export type IFarm = {
//   id: string;
//   organisation: string;
//   firestoreId: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt: Date | null;
//   facilityId?: string;
//   facility: Facility;
//   seasonId: string | null;
//   approvalStatus: string | null;
//   creationStatus: string | null;
//   houseHoldCoordinateId: string | null;
//   cultivationStartDate: string | null;
//   contractDate: string | null;
//   registrationDate: string | null;
//   certificationStartDate: string | null;
//   lastChemicalUseDate: string | null;
//   lastInspectionDate: string | null;
//   firstVisitDate: string | null;
//   certifications: any[]; // Not sure about the type of certifications
//   plots: Plot[];
//   certificationStatus: string;
//   parentFacilityName: string;
//   areaTotal: number;
// };

export type Features = {
  farmFeatures: GeoJSON.Feature[];
  polygonFeatures: GeoJSON.Feature[];
  intersections: GeoJSON;
  overlappingPolygons: GeoJSON;
  markers: Coordinates[];
  uniquePolygons: Polygon[];
};
