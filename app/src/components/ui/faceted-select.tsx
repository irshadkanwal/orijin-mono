import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command.tsx";

import { Icons } from "@/components/icons";
import type { DataTableFilterOptions } from "../table/datatable-types";
import { useFacetedSelect } from "@/hooks/common/use-faceted-select";

/**
 * Dropdown select with ability to find values, select multiple and reset.
 */
export function FacetedSelect({
  title,
  options,
  values,
  handleChange,
}: {
  title?: string;
  options?: DataTableFilterOptions[];
  values: string[];
  handleChange: (values: string[]) => void;
}) {
  const { clearValues, selectedValues, toggleOption } = useFacetedSelect({
    values,
    handleChange,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Icons.plusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options &&
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.value}{" "}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command
          filter={(value, search) => {
            const lowerCaseValue = value.toLowerCase();
            const lowerCaseSearch = search.toLowerCase();
            // Check if the value includes the search term
            if (lowerCaseValue.includes(lowerCaseSearch)) {
              return 1;
            }
            // Check if any item in selectedValues is a substring of the value
            for (const selectedValue of selectedValues) {
              if (lowerCaseValue.includes(selectedValue.toLowerCase())) {
                return 1;
              }
            }
            return 0;
          }}
        >
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options &&
                options.map((option, index) => {
                  const isSelected = selectedValues.has(option.value);
                  return (
                    <CommandItem
                      key={`${option.value}-${index}`}
                      onSelect={() => {
                        toggleOption(option.value);
                      }}
                      className={cn(
                        "flex flex-col items-start gap-2 my-1 py-4",
                        isSelected ? "bg-accent" : ""
                      )}
                    >
                      <span>{option.value}</span>

                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {option.label}
                      </span>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearValues}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
