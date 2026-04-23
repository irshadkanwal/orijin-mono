import { useEffect, useState } from "react";
import { Table } from "@tanstack/react-table";
import { useColumnStore } from "@/store/columns";
import { useRouterState } from "@tanstack/react-router";

export function useDataTableViewOptions<TData>(
  table: Table<TData>,
  tab?: string
) {
  const [key, setKey] = useState<string>("");
  const { location } = useRouterState();
  const { getColumnVisibility, setColumnVisibility } = useColumnStore();

  useEffect(() => {
    const newKey = tab ? `${location.pathname}/${tab}` : location.pathname;
    setKey(newKey);
  }, [location.pathname, tab]);

  useEffect(() => {
    if (!key || table.getAllColumns().length === 0) return;
    const storedColumns = getColumnVisibility(key);
    if (storedColumns === null || storedColumns.length === 0) {
      const columns = table.getAllColumns().map((column) => column.id);
      setColumnVisibility(key, columns);
      return;
    }
    // Set visibility based on stored columns
    table.getAllColumns().forEach((column) => {
      if (storedColumns.includes(column.id)) {
        column.toggleVisibility(true);
      } else {
        column.toggleVisibility(false);
      }
    });
  }, [getColumnVisibility, key, setColumnVisibility, table, location]);

  const handleCheckedChange = (
    column: any,
    columnId: string,
    isVisible: boolean
  ) => {
    const currentColumns = getColumnVisibility(key);
    column.toggleVisibility(isVisible);
    const newColumns = isVisible
      ? [...currentColumns, columnId]
      : currentColumns.filter((col) => col !== columnId);
    setColumnVisibility(key, newColumns);
  };

  return {
    handleCheckedChange,
  };
}
