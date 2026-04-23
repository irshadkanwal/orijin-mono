import { useState } from "react";
import type {
  ColumnDef,
  Table,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
// eslint-disable-next-line no-duplicate-imports
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { CustomColumnMeta } from "../utils/generate-form-field";

type ExtendedColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  meta?: CustomColumnMeta;
};

export function useDataTable<TData, TValue>(
  data: TData[],
  columns: ExtendedColumnDef<TData, TValue>[]
) {
  const getInitialVisibility = () => {
    return columns.reduce<VisibilityState>((acc, column) => {
      if (column.id) {
        acc[column.id] = column.meta?.isVisible !== false; // Set visibility based on `meta.isVisible`
      }
      return acc;
    }, {});
  };

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(getInitialVisibility);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table: Table<TData> = useReactTable<TData>({
    data,
    columns,
    initialState: {
      columnVisibility: getInitialVisibility(),
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    manualPagination: true,
    manualFiltering: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return { table, rowSelection, columnVisibility, columnFilters, sorting };
}
