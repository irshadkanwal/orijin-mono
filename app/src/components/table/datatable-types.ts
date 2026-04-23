import type { Column, ColumnDef, Table } from "@tanstack/react-table";
import type * as react from "react";
import type { LucideProps } from "lucide-react";
import type { SearchFrom } from "@/config/rootKeys";
import type {
  DataTableFilter as ServerDataTableFilter,
  DataTableFilterOptions as ServerDataTableFilterOptions,
} from "@orijin-server/filters/models/filters.model";
import type { TableFilterSchema } from "@/types/table-filter";
import { DialogType } from "@/hooks/use-dialog";

export interface DataTableProps<
  TData,
  TValue,
  TQuery extends TableFilterSchema,
> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  count: number;
  searchFrom: SearchFrom;
  filters: DataTableFilter[];
  tableQuerySchema: TQuery;
  fields: string[];
  isFiltrationActive: boolean;
  tab?: string;
  onMultipleSelection?: (dialogType: DialogType, list: any[]) => any;
  isV1DataTable?: boolean;
}

export interface GetColumnFunction {
  (table: Table<unknown>): Column<unknown> | undefined;
}

export interface DataTableFilterOptions extends ServerDataTableFilterOptions {
  icon?: react.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
}

export interface DataTableFilter extends ServerDataTableFilter {
  /** Text field size */
  size?: "s" | "m";
  filterFieldId?: string;
  getColumn?: GetColumnFunction;
  options?: DataTableFilterOptions[];
}

export interface DataTableToolbarProps<TQuery extends TableFilterSchema> {
  searchFrom: SearchFrom;
  filters: DataTableFilter[];
  tableQuerySchema: TQuery;
  getFilteredOptions?: (
    filter: DataTableFilter
  ) => DataTableFilterOptions[] | undefined;
}
