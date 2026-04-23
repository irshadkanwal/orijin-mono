import { SortingButton } from "@/components/table/sorting-button";
import { ILocation } from "@/types/location";
import { ColumnHelper } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { rootKeys } from "@/config/rootKeys";
import { locationsTableQuerySchema } from "@/types/locations-types";

export const locationsColumnHelper: ColumnHelper<ILocation> =
  createColumnHelper<ILocation>();

export const locationsTableFilters = [
  { type: "text", key: "name", label: "Name" },
  { type: "sort", key: "sort", label: "Sort" },
  { type: "sortOrder", key: "sortOrder", label: "Sort Order" },
];

export const locationsTypes = [
  { id: "District", name: "District" },
  { id: "SubCounty", name: "SubCounty" },
  { id: "Parish", name: "Parish" },
  { id: "Village", name: "Village" },
];

export const locationsTableColumns = [
  locationsColumnHelper.accessor("name", {
    id: "name",
    cell: (cell) => <b>{cell.getValue()}</b>,
    header: () => (
      <SortingButton
        columnName="Name"
        searchFrom={rootKeys.configurationsLocations}
        filters={locationsTableFilters}
        tableQuery={locationsTableQuerySchema}
      ></SortingButton>
    ),
  }),
  locationsColumnHelper.accessor("type", {
    id: "Type",
    meta: {
      type: "select",
      list: locationsTypes,
    },
  }),
  locationsColumnHelper.accessor("shortCode", {
    id: "Short Code",
  }),
  locationsColumnHelper.accessor("parentId", {
    id: "Parent",
    header: () => <>Parent</>,
    cell: (cell: any) => cell.row.original.parent?.name ?? "",
    meta: {
      type: "select",
      list: [],
      condition: {
        field: "type",
        values: locationsTypes
          .filter((type) => type.id !== "District")
          .map((type) => type.id),
      },
      importId: "parentCode"
    },
  }),
];
