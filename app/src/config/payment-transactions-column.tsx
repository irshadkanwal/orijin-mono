import { Lot } from "@/types/lot";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { commonFilters, createWithoutCommonColumns } from "./common-columns";
import { DataTableFilter } from "@/components/table/datatable-types";
import { Link } from "@tanstack/react-router";
import { tablePathSegments } from "./rootKeys";

export const lotsColumnHelper: ColumnHelper<Lot> = createColumnHelper<Lot>();

export const initialPaymentTransactionsColumns = createWithoutCommonColumns(lotsColumnHelper, {
  First_Name: {
    id: "First Name",
    header: "First Name",
    cell: (cell: any) => {
        return  <Link
        to={tablePathSegments.PAYMENT_TRANSACTION + cell.row.original.id}
      > {cell.row.original.payeeFirstName} </Link>
    }
  },
  Last_Name: {
    id: "Last Name",
    header: "Last Name",
    cell: (cell:any) => cell.row.original.payeeLastName
    
  },
  organisation: "organisation",
  status: "status",
  lot:{
    id:"lot",
    header: "Lot",
    cell:(cell: any) => {
        return (
            <Link to={tablePathSegments.LOTS + cell.row.original.lot.id}>
              {cell.row.original.lot.idCode}
            </Link>
          );
    }
  },
  farm: {
    id: "farm",
    header: "Farm",
    cell: (cell:any) => {
      return (
        <Link to={tablePathSegments.FARM + cell.row.original.farm.id}>
          {cell.row.original.farm.facility.shortCode}
        </Link>
      );
    },
  },
});

export const paymentTransactionsTableFilters: DataTableFilter[] = [...commonFilters];
