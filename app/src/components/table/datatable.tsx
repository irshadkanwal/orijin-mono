import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "@/components/table/datatable-toolbar.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { DataTablePagination } from "@/components/table/datatable-pagination.tsx";
import type { DataTableProps } from "@/components/table/datatable-types.ts";
import { flexRender } from "@tanstack/react-table";
import { useDataTable } from "@/hooks/data-table/use-data-table.ts";
import { DataTableViewOptions } from "./datatable-view-options";
import { selectColumn } from "./datatable-select-column";
import { DataTableExportButton } from "./datatable-export-button";
import { DataTableActionButton } from "./datatable-action-button";
import { useRef } from "react";
import ExportPdfButton from "../export-pdf-button";
import type { TableFilterSchema } from "@/types/table-filter";

export function DataTable<TData, TValue, TQuery extends TableFilterSchema>({
  columns,
  data,
  searchFrom,
  filters,
  count,
  tableQuerySchema,
  fields,
  isFiltrationActive,
  tab,
  onMultipleSelection,
  isV1DataTable,
}: DataTableProps<TData, TValue, TQuery>) {
  const pageRef = useRef<HTMLDivElement>(null);
  const cols = [selectColumn, ...columns];
  const { table } = useDataTable(data, cols);
  const isRowSelected = table.getSelectedRowModel().flatRows.length > 0;

  return (
    <>
      <div
        className="grid auto-rows-max items-start gap-2 md:gap-4 lg:col-span-2"
        ref={pageRef}
      >
        {isFiltrationActive && (
          <div className="flex justify-between items-start gap-2 md:gap-4">
            <div className="flex items-left gap-2">
              <DataTableToolbar
                searchFrom={searchFrom}
                filters={filters}
                tableQuerySchema={tableQuerySchema}
              />
            </div>
            <div className="flex justify-end items-center gap-2">
              {isRowSelected && (
                <DataTableActionButton
                  table={table}
                  onMultipleSelection={(dialogType, list) => {
                    if (!onMultipleSelection) return;
                    onMultipleSelection(dialogType, list);
                  }}
                />
              )}
              <DataTableViewOptions table={table} tab={tab} />
              <ExportPdfButton elementRef={pageRef} filename="farms" />
              <DataTableExportButton
                table={table}
                columns={cols}
                searchFrom={searchFrom}
                isV1DataTable={isV1DataTable}
              />
            </div>
          </div>
        )}
        <Card className="w-full overflow-auto h-full">
          <CardContent className="max-h-[calc(100vh-310px)] h-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="capitalize">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        row.toggleSelected();
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {isFiltrationActive && (
          <div className="mt-2">
            <DataTablePagination
              table={table}
              totalRows={count}
              searchFrom={searchFrom}
              tableQuery={tableQuerySchema}
              fields={fields}
            />
          </div>
        )}
      </div>
    </>
  );
}
