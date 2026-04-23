import { create } from "zustand";

export type Filter = {
  type: "sort" | "sortOrder" | "location";
  options?: { value: string; label: string }[];
};

export type SortState = {
  label: string;
  order: "asc" | "desc" | "";
};

const initializeSortStates = (): SortState[] => {
  const urlParams = new URLSearchParams(window.location.search);
  const sortParam = urlParams.get("sort");
  const sortOrderParam = urlParams.get("sortOrder");

  if (sortParam && sortOrderParam) {
    const sortLabels = sortParam.split(",");
    const sortOrders = sortOrderParam.split(",");

    const sortStates: SortState[] = sortLabels.map((label, index) => ({
      label,
      order: sortOrders[index] as "asc" | "desc",
    }));

    return sortStates;
  }

  return [];
};

const initializeItem = (columnName?: string): string[] | null => {
  if (!columnName) return null;
  const urlParams = new URLSearchParams(window.location.search);
  const item = urlParams.get(columnName);
  return item ? item.split(",") : null;
};

export const createGenericFiltersStore = (columnId?: string) => {
  return create<{
    item: string[] | null;
    setItem: (item: string[] | null) => void;
    sortStates: SortState[];
    setSortStates: (sortStates: SortState[]) => void;
  }>((set) => ({
    item: initializeItem(columnId),
    setItem: (item) => {
      set({ item });
    },
    sortStates: initializeSortStates(),
    setSortStates: (sortStates) => {
      set({ sortStates });
    },
  }));
};
