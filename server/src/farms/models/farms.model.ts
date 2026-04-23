import {
  Certification as PrismaCertification,
  CountItem as PrismaCountItem,
} from '.prisma/client';
import { Prisma, SatelliteAnalysis } from '@prisma/client';
import { Plot } from './plots.model';
import { Location } from './../../locations/models/locations.model';
import { Facility } from '../../facilities/models/facility.model';
import { Season } from '../../seasons/models/seasons.model';

export enum ReviewStatus {
  NeedsReview = 'NeedsReview',
  InReview = 'InReview',
  Rejected = 'Rejected',
  Approved = 'Approved',
  TentativelyApproved = 'TentativelyApproved',
  ApprovedWithConditions = 'ApprovedWithConditions',
}

export enum CertificationStatus {
  Certified = 'Certified',
  New = 'New',
  NotCertified = 'NotCertified',
  InTransition = 'InTransition',
  NeverCertified = 'NeverCertified',
  Expelled = 'Expelled',
  Suspended = 'Suspended',
  Sanctioned = 'Sanctioned',
}

export enum CreationStatus {
  DataImport = 'DataImport',
  ByUser = 'ByUser',
  InBuying = 'InBuying',
}

const farmWithRelations = Prisma.validator<Prisma.FarmDefaultArgs>()({
  include: { facility: true, plots: true },
});

// Pattern from https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types
// TODO: Still bit verbose to remove manually all the relationId's, and optional values which get translated to "value | null" in Prisma.. any workaround for those?
export interface Farm
  extends Omit<Prisma.FarmGetPayload<typeof farmWithRelations>, 'facilityId'> {
  approvalStatus: ReviewStatus | null;
  certificationStatus: CertificationStatus | null;
  creationStatus: CreationStatus | null;
  plots: Plot[];
  certifications?: PrismaCertification[];
  facility: Facility;
  satelliteAnalysis?: SatelliteAnalysis[];
  season?: Season;
  // Calculated fields
  totalArea?: number;
  updatedBy?: string;
}

export enum CountType {
  MainCrop = 'MainCrop',
  Shade = 'Shade',
  Goat = 'Goat',
  Cow = 'Cow',
  Chicken = 'Chicken',
}

export enum CountSubType {
  Productive = 'Productive',
  Young = 'Young',
  Stumped = 'Stumped',
}

export enum CountCategory {
  Plant = 'Plant',
  Animal = 'Animal',
}

// numberOfPlants              Int?
// numberOfPlantsProductive    Int?
// numberOfPlantsNonProductive Int?
// numberOfPlantsYoung         Int?
// numberOfPlantsStumped       Int?
// numberOfPlantsTotal         Int?
// numberOfPlantsShade         Int?

export interface CountItem extends PrismaCountItem {
  type: CountType;
  category: CountCategory;
  subType: CountSubType;
}

// Minimal version
export type Coordinate = [number, number];

export interface FacilityMinimal {
  id: string;
  shortCode: string;
  name: string;
  coordinate?: Coordinate[];
}

export interface FarmMinimal {
  id: string;
  season?: {
    shortCode: string;
  };
  facility: FacilityMinimal;
  plots: Plot[];
  updatedBy?: string;
  updatedAt?: Date;
}
interface WarningCount {
  [key: string]: number;
}
export interface FarmActivePolygon {
  organisation: string;
  chartData: { warningCount: WarningCount };
  data: FarmMinimal[];
  count: number;
}
