import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { DataTableFilter } from "@/components/table/datatable-types.ts";
import { updateSortFields } from "../utils/filter-helper";
import type { SearchFrom } from "@/config/rootKeys";
import type { TableFilterSchema } from "@/types/table-filter";
import type { z } from "zod";

export type FilterValues = Record<string, number | string | boolean | string[]>;

export type useTableFilterProps<TQuery extends TableFilterSchema> = {
  filters: DataTableFilter[];
  searchFrom: SearchFrom;
  tableQuerySchema: TQuery;
};

const getFilterValues = <TQuery extends TableFilterSchema>(
  filters: DataTableFilter[],
  searchUrlParams: z.output<TQuery>
) => {
  return filters.reduce((acc, filter) => {
    const key = filter.key;
    if (key in searchUrlParams) {
      const value = (searchUrlParams as Record<string, unknown>)[key];
      if (filter.type === "boolean") {
        const v = value === true ? true : false;
        acc[filter.key] = v;
      } else if (filter.type === "select") {
        const v = value !== "" ? String(value) : "";
        acc[filter.key] = v;
      } else if (filter.type === "faceted") {
        const v = value ? String(value).split(",") : [];
        acc[filter.key] = v;
      } else {
        const v = value !== "" ? String(value) : "";
        acc[filter.key] = v;
      }
    }
    return acc;
  }, {} as FilterValues);
};

export function useTableFilter<TQuery extends TableFilterSchema>({
  filters,
  searchFrom,
  tableQuerySchema: tableQuery,
}: useTableFilterProps<TQuery>) {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const search: z.output<TQuery> = useSearch({ from: searchFrom as any }); // FIXME: any
  const [filterValues, setFilterValues] = useState<FilterValues>(
    getFilterValues(filters, tableQuery.parse(search))
  );

  useEffect(() => {
    setFilterValues(getFilterValues(filters, search));
  }, [search, filters]);

  const handleFilterChange = useCallback(
    async (newFilters: FilterValues) => {
      setFilterValues((prev) => ({
        ...prev,
        ...newFilters,
      }));

      const updatedSearch = { ...search };
      const sortFields = updatedSearch.sort?.split(",").filter(Boolean) ?? [];
      const sortOrderValues =
        updatedSearch?.sortOrder?.split(",").filter(Boolean) ?? [];

      updateSortFields(newFilters, updatedSearch, sortFields, sortOrderValues);

      Object.entries(newFilters).forEach(([key, value]) => {
        if (key !== "sort" && key !== "sortOrder") {
          const newValue = Array.isArray(value)
            ? value.length == 0
              ? undefined
              : value.join(",")
            : value;

          const genericSearch = updatedSearch as Record<string, unknown>;
          if (newValue === undefined) {
            delete genericSearch[key];
          } else {
            genericSearch[key] = newValue;
          }
        }
      });

      await navigate({
        search: updatedSearch,
      });
    },
    [navigate, search]
  );

  const clearFilters = useCallback(async () => {
    const updatedSearch = { ...search };
    const genericSearch = updatedSearch as Record<string, unknown>;
    filters.forEach((filter) => delete genericSearch[filter.key]);

    setFilterValues(
      filters.reduce((acc, filter) => {
        acc[filter.key] = [];
        return acc;
      }, {} as FilterValues)
    );

    await navigate({
      search: updatedSearch,
    });
  }, [filters, navigate, search]);

  return {
    filterValues,
    handleFilterChange,
    clearFilters,
  };
}
