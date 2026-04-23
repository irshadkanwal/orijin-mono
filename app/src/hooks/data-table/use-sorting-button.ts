import { useState, useEffect } from "react";
import type { DataTableFilter } from "@/components/table/datatable-types";
import { useFilters } from "@/store/farms";
import type { SearchFrom } from "@/config/rootKeys";
import { useTableFilter } from "./use-table-filter";
import type { TableFilterSchema } from "@/types/table-filter";

// 0 = no sort, 1 = ascending, 2 = descending
type SortStateValue = 0 | 1 | 2;

type UseSortingButtonProps<TQuery extends TableFilterSchema> = {
  columnName: string;
  filters: DataTableFilter[];
  searchFrom: SearchFrom;
  tableQuery: TQuery;
};

export function useSortingButton<TQuery extends TableFilterSchema>({
  columnName,
  filters,
  searchFrom,
  tableQuery,
}: UseSortingButtonProps<TQuery>) {
  const { sortStates, setSortStates } = useFilters();
  const [sortState, setSortState] = useState<SortStateValue>(() => {
    const foundState = sortStates.find(
      (state) => state.label.toLowerCase() === columnName.toLowerCase()
    );
    return foundState
      ? foundState.order === "asc"
        ? 1
        : foundState.order === "desc"
          ? 2
          : 0
      : 0;
  }); // 0 = no sort, 1 = ascending, 2 = descending

  const { handleFilterChange } = useTableFilter({
    filters,
    searchFrom,
    tableQuerySchema: tableQuery,
  });

  useEffect(() => {
    const foundState = sortStates.find(
      (state) => state.label.toLowerCase() === columnName.toLowerCase()
    );
    if (foundState) {
      setSortState(
        foundState.order === "asc" ? 1 : foundState.order === "desc" ? 2 : 0
      );
    }
  }, [sortStates, columnName]);

  const handleSortClick = () => {
    const newSortState = ((sortState + 1) % 3) as SortStateValue;
    setSortState(newSortState);

    const newFilters = {
      sort: [columnName.toLowerCase()],
      sortOrder: [
        newSortState === 0 ? "" : newSortState === 1 ? "asc" : "desc",
      ],
    };

    setSortStates([
      ...sortStates.filter(
        (state) => state.label.toLowerCase() !== columnName.toLowerCase()
      ),
      {
        label: columnName,
        order: newSortState === 0 ? "" : newSortState === 1 ? "asc" : "desc",
      },
    ]);

    void handleFilterChange(newFilters);
  };

  return {
    sortState,
    handleSortClick,
  };
}
