import type { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { useEffect } from "react";
import type { SearchFrom } from "@/config/rootKeys";
import { useTablePagination } from "@/hooks/data-table/use-table-pagination";
import type { TableFilterSchema } from "@/types/table-filter";

interface DataTablePaginationProps<TData, TQuery extends TableFilterSchema> {
  table: Table<TData>;
  searchFrom: SearchFrom;
  totalRows: number;
  tableQuery: TQuery;
  fields: string[];
}

export function DataTablePagination<TData, TQuery extends TableFilterSchema>({
  table,
  searchFrom,
  totalRows,
  tableQuery,
  fields,
}: DataTablePaginationProps<TData, TQuery>) {
  const {
    page,
    limit,
    totalPages,
    handlePageSizeChange,
    canGoNextPage,
    canGoPreviousPage,
    handleFirstPage,
    handlePreviousPage,
    handleNextPage,
    handleLastPage,
  } = useTablePagination(searchFrom, 1, 10, totalRows, tableQuery, fields);

  useEffect(() => {
    table.setPageIndex(page - 1); // Convert to zero-based index
    table.setPageSize(limit);
  }, [page, limit, table]);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of {totalRows} row(s)
        selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              handlePageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of {totalPages === 0 ? 1 : totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handleFirstPage}
            disabled={!canGoPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handlePreviousPage}
            disabled={!canGoPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleNextPage}
            disabled={!canGoNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handleLastPage}
            disabled={!canGoNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
