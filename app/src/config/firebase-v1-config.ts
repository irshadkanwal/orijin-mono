import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  DataTableFilter,
  DataTableFilterOptions,
} from "@/components/table/datatable-types";
import { DataTableFilterType } from "@orijin-server/filters/models/filters.model";

interface BackendColumn {
  title: string;
  value?: string;
  valueJsonata?: string;
  filtering?: boolean;
  primary?: boolean;
  defaultSize?: "sm" | "md" | "lg";
  sortingKey?: string;
}

interface BackendFilter {
  key: string;
  operation: string;
  value: string;
}

interface BackendData {
  columns: BackendColumn[];
  filters: BackendFilter[];
}

const getNestedValue = (obj: any, path: string) => {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== "undefined" ? acc[key] : undefined),
      obj
    );
};

export function transformBackendColumns<TData>(
  columns: BackendColumn[]
): ColumnDef<TData, any>[] {
  const columnHelper = createColumnHelper<TData>();

  return columns.map((backendColumn) => {
    const accessorKey = backendColumn.value || backendColumn.valueJsonata || "";

    return columnHelper.accessor((row) => getNestedValue(row, accessorKey), {
      id: backendColumn.title,
      header: backendColumn.title,
      cell: (cell) => {
        const value = cell.getValue();
        // Handle specific value formatting if required (e.g., date, number formatting)
        return typeof value === "object" ? JSON.stringify(value) : value;
      },
      meta: {
        isPrimary: backendColumn.primary || false,
        filtering: backendColumn.filtering || false,
        defaultSize: backendColumn.defaultSize || "md",
      },
    });
  });
}

// Transform backend filters to DataTableFilter
export function transformBackendFilters(
  filters: BackendFilter[]
): DataTableFilter[] {
  return filters.map((backendFilter) => ({
    key: backendFilter.key,
    label: backendFilter.key,
    type: determineFilterType(backendFilter),
    placeholder: `Filter by ${backendFilter.key}`,
    options: backendFilterOptions(backendFilter),
  }));
}

function determineFilterType(
  backendFilter: BackendFilter
): DataTableFilterType {
  switch (backendFilter.operation) {
    case "==":
      return "text";
    case "!=":
      return "select";
    case "boolean":
      return "boolean";
    case ">":
    case "<":
      return "date";
    default:
      return "text";
  }
}

function backendFilterOptions(
  backendFilter: BackendFilter
): DataTableFilterOptions[] | undefined {
  // If the backend provides options for filters (like in select), map them here

  return backendFilter.value === "select"
    ? [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ]
    : undefined;
}
