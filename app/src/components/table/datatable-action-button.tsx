import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button.tsx";
import { Icons } from "@/components/icons.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import type { Table } from "@tanstack/react-table";
import { DialogType } from "@/hooks/use-dialog";

type DataTableActionButtonProps<TData> = {
  table: Table<TData>;
  onMultipleSelection: (dialogType: DialogType, list: any[]) => any;
};

export function DataTableActionButton<TData>({
  table,
  onMultipleSelection,
}: DataTableActionButtonProps<TData>) {
  const getSearchParams = () => {
    const ids: string[] = [];

    table.getSelectedRowModel().rows.forEach((row) => {
      ids.push(row.original.id);
    });

    return { farmIds: ids };
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1 text-sm">
          <Icons.settings className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Action</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto h-auto">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              to="/farms/eudr-report"
              search={getSearchParams()}
              target="_blank"
              className="block text-sm hover:bg-accent hover:text-accent-foreground"
            >
              EUDR Report
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              onMultipleSelection(
                DialogType.EDIT_SELECTED,
                table.getSelectedRowModel().flatRows.map((row) => row.original)
              )
            }
            className="capitalize"
          >
            {DialogType.EDIT_SELECTED}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="capitalize"
            onClick={() =>
              onMultipleSelection(
                DialogType.DELETE_SELECTED,
                table.getSelectedRowModel().flatRows.map((row) => row.original)
              )
            }
          >
            {" "}
            {DialogType.DELETE_SELECTED}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
