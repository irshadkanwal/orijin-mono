import { DataTableFilter } from "@/components/table/datatable-types";
import { Vessel } from "@/types/vessels";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { commonFilters, createColumns } from "./common-columns";
// Vessels COLUMNS
export const vesselsColumnHelper: ColumnHelper<Vessel> =
  createColumnHelper<Vessel>();
export const initialVesselsColumns = createColumns(vesselsColumnHelper, {
  type: {
    id: "type",
  },
  subType: {
    id: "subType",
    header: "Sub Type",
  },
  size: {
    id: "size",
    header: "Size",
    meta: {
      errors: [],
      type: "number",
    },
  },
  weight: {
    id: "weight",
    header: "Weight",
    meta: {
      errors: [],
      type: "number",
    },
  },
  permanent: {
    id: "permanent",
    header: "Permanent",
    meta: {
      type: "checkbox",
      errors: [],
    },
  },
  description: {
    id: "description",
    meta: {
      errors: [],
    },
  },
  facilityId: {
    id: "Facility",
    header: "Facility Name",
    cell: (cell: any) => cell.row.original.facility?.name,
    meta: {
      type: "select",
      list: [],
      errors: [],
      importId: "facilityCode",
    },
  },
  plotId: {
    id: "Plot",
    header: "Plot",
    cell: (cell: any) => cell.row.original.plot?.name,
    meta: {
      type: "select",
      list: [],
      errors: [],
      importId: "plotCode",
    },
  },
});
export const vesselsTableFilters: DataTableFilter[] = [...commonFilters];