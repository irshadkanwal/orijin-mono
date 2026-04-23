import { Checkbox } from "@/components/ui/checkbox";
import type { Table, Row } from "@tanstack/react-table";

export const selectColumn = {
  id: "select",
  header: ({ table }: { table: Table<any> }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => {
        table.toggleAllPageRowsSelected(!!value);
      }}
      aria-label="Select all"
      className="h-4 w-4"
    />
  ),
  cell: ({ row }: { row: Row<any> }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => {
        row.toggleSelected(!!value);
      }}
      aria-label="Select row"
      className="h-4 w-4"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};
