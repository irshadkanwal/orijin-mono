import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ColumnVisibility = {
  key: string;
  columns: string[];
};

type ColumnStore = {
  columnVisibility: ColumnVisibility[];
  setColumnVisibility: (key: string, columns: string[]) => void;
  getColumnVisibility: (key: string) => string[];
};

export const useColumnStore = create(
  persist<ColumnStore>(
    (set, get) => ({
      columnVisibility: [],
      setColumnVisibility: (key, columns) => {
        const existing = get().columnVisibility.find((cv) => cv.key === key);
        if (existing) {
          set((state) => ({
            columnVisibility: state.columnVisibility.map((cv) =>
              cv.key === key ? { key, columns } : cv
            ),
          }));
        } else {
          set((state) => ({
            columnVisibility: [...state.columnVisibility, { key, columns }],
          }));
        }
      },
      getColumnVisibility: (key) => {
        const existing = get().columnVisibility.find((cv) => cv.key === key);
        return existing ? existing.columns : [];
      },
    }),
    {
      name: "column-visibility",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export type { ColumnVisibility, ColumnStore };
