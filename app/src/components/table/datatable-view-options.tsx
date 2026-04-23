import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Icons } from "@/components/icons";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDataTableViewOptions } from "@/hooks/data-table/use-view-options";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  tab?: string;
}

export function DataTableViewOptions<TData>({
  table,
  tab,
}: DataTableViewOptionsProps<TData>) {
  const { handleCheckedChange } = useDataTableViewOptions(table, tab);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 gap-1 lg:flex"
        >
          <Icons.settings2 className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[auto] max-h-[350px] overflow-y-auto">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onSelect={(e) => {
                e.preventDefault();
              }}
              onCheckedChange={(value) => {
                handleCheckedChange(column, column.id, !!value);
              }}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
