import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { commonFilters, createWithoutCommonColumns } from "./common-columns";
import { DataTableFilter } from "@/components/table/datatable-types";
import { formatDate } from "@/lib/utils";
import { Price } from "@/types/price";
import { FormError } from "@/types/custom-form";

export const pricesColumnHelper: ColumnHelper<Price> = createColumnHelper<Price>();

export const initialPricesColumns = createWithoutCommonColumns(pricesColumnHelper, {
    shortCode: {
        id: "Code",
        header: "Code",
        meta: {
            errors: []
        }
    },
    unit: {
        id: "Unit",
        header: "Unit",
    },
    amount: {
        id: "Amount",
        header: "Amount",
        cell: (cell: any) => parseInt(cell.row.original.amount),
        meta: {
            type: "number",
            errors: [FormError.NUMBER]
        },
    },
    perAmountUnit: {
        id: "Per Amount Unit",
        header: "Per Amount Unit",
        cell: (cell: any) => cell.row.original.perAmountUnit,
    },
    perAmountAmount: {
        id: "Per Amount Amount",
        header: "Per Amount Amount",
        cell: (cell: any) => parseInt(cell.row.original.perAmountAmount),
        meta: {
            type: "number",
            errors: [FormError.NUMBER]
        },
    },
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
    productId: {
        id: "Product Id",
        header: "Product Id",
        meta: {
            type: 'select',
            list: [],
            errors: [],
            importId: "productCode"
        },
    }
})

export const pricesTableFilters: DataTableFilter[] = [...commonFilters];