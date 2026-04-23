import { Table } from "@tanstack/react-table";

export function getVisibleColumns<TData>(table: Table<TData>) {
  return table
    .getAllColumns()
    .map((column) => {
      if (column.getIsVisible()) {
        return column.id;
      }
      return null;
    })
    .filter(Boolean);
}
