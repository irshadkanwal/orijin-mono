import { Lot } from "@/types/lot";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { createWithoutCommonColumns } from "./common-columns";
import { DataTableFilter } from "@/components/table/datatable-types";
import { Link } from "@tanstack/react-router";
import { tablePathSegments } from "./rootKeys";

export const lotsColumnHelper: ColumnHelper<Lot> = createColumnHelper<Lot>();

export const initialLotsColumns = createWithoutCommonColumns(lotsColumnHelper, {
  Code: {
    id: "Code",
    header: "Code",
    cell: (cell: any) => {
      return (
        <Link to={tablePathSegments.LOTS + cell.row.original.id}>
          {cell.row.original.idCode}
        </Link>
      );
    },
  },
  organisation: "organisation",
  status: "status",
  farm: {
    id: "farm",
    header: "Farm",
    cell: (cell: any) => {
      return (
        <Link to={tablePathSegments.FARM + cell.row.original.farm.id}>
          {cell.row.original.farm.facility.shortCode}
        </Link>
      );
    },
  },
  payments: {
    id: "payments",
    header: "Payments",
    cell: (cell: any) => {
      return (
        cell.row.original.payments && (
          <Link
            to={
              tablePathSegments.PAYMENT_TRANSACTION +
              cell.row.original?.payments[0]?.id
            }
          >
            {cell.row.original?.payments[0]?.payeeFirstName}
          </Link>
        )
      );
    },
  },
});

export const lotsTableFilters: DataTableFilter[] = [
  {
    key: "idCode",
    label: "idCode",
    type: "text",
  },
];
