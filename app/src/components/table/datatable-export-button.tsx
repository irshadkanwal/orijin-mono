import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, Table } from "@tanstack/react-table";
import { exportTableToExcel } from "@/hooks/utils/export-helpers";
import { RootKeyValues } from "@/config/rootKeys";
import {
  useRouteContext,
  useRouterState,
  useSearch,
} from "@tanstack/react-router";
import { useTableExportHandler } from "@/hooks/data-table/use-table-export-handler.ts";
import { getVisibleColumns } from "@/components/table/utils";

type DataTableExportButtonProps<TData, TValue> = {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
  searchFrom: RootKeyValues;
  isV1DataTable?: boolean;
};

export function DataTableExportButton<TData, TValue>({
  table,
  columns,
  searchFrom,
  isV1DataTable,
}: DataTableExportButtonProps<TData, TValue>) {
  const { auth, queryClient } = useRouteContext({ from: searchFrom });
  const { location } = useRouterState();
  const search = useSearch({ from: searchFrom });
  const VISIBLE_COLUMNS = getVisibleColumns(table);
  const { handleExportAll, handleExportAllGeoJson } = useTableExportHandler({
    auth,
    queryClient,
    columns,
    pathName: location.pathname,
    visibleColumns: VISIBLE_COLUMNS,
  });

  const handleExportSelected = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.getVisibleCells().map((cell) => cell.getValue()));
    exportTableToExcel(VISIBLE_COLUMNS, selectedRows, "selected-rows-data");
  };

  const isRowSelected = table.getSelectedRowModel().flatRows.length > 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <Icons.page className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuGroup className="text-center">
          <DropdownMenuItem
            onClick={() => handleExportAll(search, isV1DataTable)}
          >
            All table
          </DropdownMenuItem>
          {location.pathname.includes("farms") && (
            <DropdownMenuItem onClick={() => handleExportAllGeoJson(search)}>
              Export GeoJson
            </DropdownMenuItem>
          )}
          {isRowSelected && (
            <DropdownMenuItem onClick={handleExportSelected}>
              Selected rows
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
