import { Facility as PrismaFacility } from '.prisma/client';
import { Address, Location } from '../../locations/models/locations.model';
import { Person } from '../../persons/models/persons.model';
import { Coordinate } from '../../farms/models/farms.model';

export enum FacilityType {
  Farm = 'Farm',
  ProductionFacility = 'ProductionFacility',
  RoastingFacility = 'RoastingFacility',
  CollectionFacility = 'CollectionFacility',
  ProcessingFacility = 'ProcessingFacility',
  FermentationFacility = 'FermentationFacility',
  Organisation = 'Organisation',
  Community = 'Community',
}

export interface Facility extends PrismaFacility {
  type: FacilityType;
  address: Address | null;
  mainContactPerson?: Person | null;
  location?: Location;
  coordinate?: Coordinate[];
  customLocation?: Location;
}
