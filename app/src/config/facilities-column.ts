import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { commonFilters, createColumns } from "./common-columns";
import { Facility } from "@/types/farm";
import { DataTableFilter } from "@/components/table/datatable-types";
export type Address = {
  city?: string;
  street?: string;
  country?: string;
  postalCode?: string;
};

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
const facilityTypeOptions = Object.entries(FacilityType).map(([id, name]) => ({
  id,
  name,
}));

const addressToString = (address: Address): string => {
  return `${address.street}, ${address.city}, ${address.country} ${address.postalCode}`;
};

// Facility COLUMNS
export const facilityColumnHelper: ColumnHelper<Facility> =
  createColumnHelper<Facility>();

export const initialFacilityColumns = createColumns(facilityColumnHelper, {
  type: {
    id: "type",
    meta: {
      type: "select",
      list: facilityTypeOptions
    }
  },
  address: {
    id: "address",
    cell: (cell: { row: { original: Facility } }) => {
      const address = cell.row.original?.address;
      return address?.city ? addressToString(address) : address;
    },

  },
  locationId: {
    id: "Location",
    header: "Location",
    cell: (cell: any) => cell.row.original.location?.name,
    meta: {
      type: "select",
      list: [],
      errors: [],
    },
  },
  customLocationId: {
    id: "Custom Location",
    header: "Custom Location",
    cell: (cell: any) => cell.row.original.customLocation?.name,
    meta: {
      type: "select",
      list: [],
      errors: [],
    },
  },
  mainContactPersonId: {
    id: "Contact person",
    header: "Contact person",
    cell: (cell: any) => cell.row.original.mainContactPerson && cell.row.original.mainContactPerson?.firstName + " " + cell.row.original.mainContactPerson?.lastName,
    meta: {
      type: "select",
      list: [],
      errors: [],
    },
  }
});

export const facilityTableFilters: DataTableFilter[] = [...commonFilters];
