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

const initializeLocation = (): string[] | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const location = urlParams.get("location");
  return location ? location.split(",") : null;
};

export const useFilters = create<{
  location: string[] | null;
  setLocation: (location: string[] | null) => void;
  sortStates: SortState[];
  setSortStates: (sortStates: SortState[]) => void;
}>((set) => ({
  location: initializeLocation(),
  setLocation: (location) => {
    set({ location });
  },
  sortStates: initializeSortStates(),
  setSortStates: (sortStates) => {
    set({ sortStates });
  },
}));
