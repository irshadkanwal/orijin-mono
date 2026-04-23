import { DataTableFilter } from "@/components/table/datatable-types";
import { ColumnHelper } from "@tanstack/react-table";

// Common column definitions
export const commonColumns = {
    name: {
        id: "name",
    },
    shortCode: {
        id: "code",
        header: "Code",
    },
};

export const commonFilters: DataTableFilter[] = [
    {
        key: "name",
        label: "Name",
        type: "text",
    },
];

// Function to generate columns based on common and specific columns
export function createColumns<T>(columnHelper: ColumnHelper<T>, additionalColumns: Partial<Record<keyof T, any>> = {}) {
    return Object.entries({ ...commonColumns, ...additionalColumns }).map(([key, config]) =>
        columnHelper.accessor(key as keyof T as any, config)
    );
}

export function createWithoutCommonColumns<T>(columnHelper: ColumnHelper<T>, additionalColumns: Partial<Record<keyof T, any>> = {}) {
    return Object.entries({ ...additionalColumns }).map(([key, config]) =>
        columnHelper.accessor(key as keyof T as any, config as any)
    );
}