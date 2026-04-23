import { FarmsFilter } from '../../farms/dto/farms.filter.dto';
import { PlotsFilter } from '../../farms/dto/plots.filter.dto';
import { FirestoreUsersFilter } from '../../firestore/dto/firestore.users.filter.dto';
import { LocationsFilter } from '../../locations/dto/locations.filter.dto';

export interface DataTableFilterOptions {
  value: string;
  label?: string;
}

export type DataTableFilterType =
  | 'select'
  | 'text'
  | 'boolean'
  | 'faceted'
  | 'date'
  | 'relation';

export interface DataTableFilter {
  key: string;
  label?: string;
  type: DataTableFilterType;
  placeholder?: string;
  options?: DataTableFilterOptions[];
}

export enum FilterClasses {
  farms = 'farms',
  locations = 'locations',
  users = 'users',
  dashboard = 'dashboard',
  plots = 'plots',
}

export const filterClassMap = {
  [FilterClasses.farms]: FarmsFilter,
  [FilterClasses.locations]: LocationsFilter,
  [FilterClasses.users]: FirestoreUsersFilter,
  [FilterClasses.plots]: PlotsFilter,
};
