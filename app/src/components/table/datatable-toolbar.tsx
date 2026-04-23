import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import type {
  DataTableFilter,
  DataTableToolbarProps,
} from "@/components/table/datatable-types.ts";
import { useTableFilter } from "@/hooks/data-table/use-table-filter";
import { createGenericFiltersStore } from "@/store/generic-store";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import type { TableFilterSchema } from "@/types/table-filter";
import { FacetedSelect } from "../ui/faceted-select";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputFilterVariants = cva("h-8", {
  variants: {
    size: {
      s: "w-[80px] lg:w-[130px]",
      m: "w-[150px] lg:w-[250px]",
    },
  },
  defaultVariants: {
    size: "m",
  },
});

export function DataTableToolbar<TQuery extends TableFilterSchema>({
  searchFrom,
  filters = [],
  tableQuerySchema,
  // User this instead of older getFilteredList which is never used???
  getFilteredOptions,
}: DataTableToolbarProps<TQuery>) {
  const { filterValues, handleFilterChange, clearFilters } = useTableFilter({
    filters: filters,
    searchFrom: searchFrom,
    tableQuerySchema,
  });
  const useFilters = createGenericFiltersStore();
  const setItem = useFilters((state) => state.setItem);

  const isFiltered = Object.values(filterValues).some(
    (value) =>
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === "string" && value !== "") ||
      (typeof value === "number" && value !== 0) ||
      (typeof value === "boolean" && value)
  );

  const CLEAR_SELECT = "-";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filters.map((filter: DataTableFilter) => {
          switch (filter.type) {
            case "text":
              return (
                <div className="relative" key={filter.key}>
                  <Input
                    placeholder={filter.placeholder || "Search..."}
                    value={filterValues[filter.key] as string}
                    onChange={(e) => {
                      void handleFilterChange({
                        [filter.key]: [e.target.value],
                      });
                    }}
                    className={cn(inputFilterVariants({ size: filter.size }))}
                  />

                  {filterValues[filter.key] ? (
                    <a
                      className="absolute right-2 top-2"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        void handleFilterChange({
                          [filter.key]: [""],
                        });
                      }}
                    >
                      <Icons.close className="ml-2 h-4 w-4 text-muted-foreground" />
                    </a>
                  ) : null}
                </div>
              );
            case "faceted":
              return (
                <FacetedSelect
                  key={filter.key}
                  values={filterValues[filter.key] as string[]}
                  options={[
                    ...(getFilteredOptions
                      ? getFilteredOptions(filter) ?? filter.options ?? []
                      : filter.options ?? []),
                  ]}
                  title={filter.label || filter.key}
                  handleChange={(values) => {
                    void handleFilterChange({
                      [filter.key]: values,
                    });
                  }}
                />
              );
            case "select":
              return (
                <Select
                  key={filter.key}
                  value={String(filterValues[filter.key])}
                  onValueChange={(e) => {
                    void handleFilterChange({
                      [filter.key]: e === CLEAR_SELECT ? [] : [e],
                    });
                  }}
                >
                  <SelectTrigger className="w-40 h-8">
                    <SelectValue placeholder={filter.label}>
                      <span>
                        {filterValues[filter.key]
                          ? filterValues[filter.key]
                          : filter.label}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {[
                      { value: CLEAR_SELECT, label: "Clear" },
                      ...(getFilteredOptions
                        ? getFilteredOptions(filter) ?? filter.options ?? []
                        : filter.options ?? []),
                    ].map((data) => (
                      <SelectItem key={data.value} value={data.value}>
                        {data.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            case "boolean":
              return (
                <div className="flex items-center space-x-2" key={filter.key}>
                  <Switch
                    id={filter.key}
                    checked={(filterValues[filter.key] as boolean) === true}
                    onCheckedChange={(latestValue) => {
                      void handleFilterChange({
                        [filter.key]: latestValue,
                      });
                    }}
                  />
                  <Label htmlFor="airplane-mode">
                    {filter.label || filter.key}
                  </Label>
                </div>
              );
            default:
              return null; // implement other filter types as needed
          }
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              void clearFilters();
              filters.forEach(() => {
                setItem([]);
              });
            }}
            className="h-8 px-2 lg:px-3 hover:bg-red-100 hover:text-red-600"
          >
            Reset
            <Icons.close className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
