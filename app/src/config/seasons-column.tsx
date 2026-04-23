import { Season } from "@/types/season";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { commonFilters, createColumns } from "./common-columns";
import { DataTableFilter } from "@/components/table/datatable-types";
import { formatDate } from "@/lib/utils";

export const seasonsColumnHelper: ColumnHelper<Season> = createColumnHelper<Season>();

export const initialSeasonsColumns = createColumns(seasonsColumnHelper, {
    startsAt: {
        id: "Starts At",
        header: "Starts At",
        cell: (cell: any) => formatDate(cell.row.original.startsAt),
        meta: {
            type: "datePicker",
        },
    },
    endsAt: {
        id: "Ends At",
        header: "Ends At",
        cell: (cell: any) => formatDate(cell.row.original.endsAt),
        meta: {
            type: "datePicker",
            errors: []
        },
    },
    active: {
        id: "Active",
        header: "Active",
        meta: {
            type: "checkbox",
            errors: []
        },
    },
    firestoreId: {
        id: "Firestore Id",
        header: "Firestore Id",
        meta: {
            errors: []
        },
    }
})

export const seasonsTableFilters: DataTableFilter[] = [...commonFilters];