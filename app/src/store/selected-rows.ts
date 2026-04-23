import { create } from "zustand";

type SelectedRow<TData> = {
  id: string;
  cells: (keyof TData)[];
};

type SelectedRowsStore<TData> = {
  selectedRows: SelectedRow<TData>[];
  addSelectedRows: (rows: SelectedRow<TData>[]) => void;
  removeSelectedRow: (rowId: string) => void;
  clearSelectedRows: () => void;
};

const useSelectedRowsStore = create<SelectedRowsStore<any>>((set) => ({
  selectedRows: [],
  addSelectedRows: (rows) =>
    set((state) => ({
      selectedRows: [...state.selectedRows, ...rows],
    })),
  removeSelectedRow: (rowId) =>
    set((state) => ({
      selectedRows: state.selectedRows.filter((row) => row.id !== rowId),
    })),
  clearSelectedRows: () => set({ selectedRows: [] }),
}));

export { useSelectedRowsStore };
export type { SelectedRow, SelectedRowsStore };
