import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons.tsx";
import { cn } from "@/lib/utils";
import type { DataTableFilter } from "@/components/table/datatable-types";
import type { SearchFrom } from "@/config/rootKeys";
import { useSortingButton } from "@/hooks/data-table/use-sorting-button";
import type { TableFilterSchema } from "@/types/table-filter";

export type SortingButtonProps<TQuery extends TableFilterSchema> = {
  onClick?: () => void;
  columnName: string;
  className?: string;
  filters: DataTableFilter[];
  searchFrom: SearchFrom;
  tableQuery: TQuery;
};

export function SortingButton<TQuery extends TableFilterSchema>({
  columnName,
  filters,
  searchFrom,
  tableQuery,
}: SortingButtonProps<TQuery>) {
  const { sortState, handleSortClick } = useSortingButton({
    columnName,
    filters,
    searchFrom,
    tableQuery,
  });

  const iconMap = {
    0: <Icons.arrowUpDown size={16} className={cn("ml-2")} />,
    1: <Icons.arrowUp size={16} className={cn("ml-2")} />,
    2: <Icons.arrowDown size={16} className={cn("ml-2")} />,
  };

  return (
    <Button variant={"ghost"} onClick={handleSortClick}>
      {columnName} {iconMap[sortState]}
    </Button>
  );
}
