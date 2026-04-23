import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type ILocationDropdownProps = {
  list: any[] | undefined;
  onValueChange: (value: string) => void;
  selectedValue: string;
  label?: string;
};

export const LocationDropdown: React.FC<ILocationDropdownProps> = ({
  list,
  onValueChange,
  selectedValue,
  label = "location",
}) => {
  list?.sort((a, b) => {
    const typeA = a.type.toLowerCase();
    const typeB = b.type.toLowerCase();

    if (typeA < typeB) {
      return -1;
    }
    if (typeA > typeB) {
      return 1;
    }

    // If types are equal, compare names
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  const [open, setOpen] = useState(false);

  const handleSelect = (currentValue: string) => {
    const selectedItem = list?.find((item) => item.id === currentValue);
    if (selectedItem) {
      onValueChange(currentValue);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedValue
            ? list?.find((item) => item.id === selectedValue)?.name
            : "Select " + label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command>
          <CommandInput placeholder={"Search " + label} className="h-9" />
          <CommandList>
            <CommandEmpty>{"No " + label + " found."}</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {list?.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => handleSelect(item.id)}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center">
                      <CheckIcon
                        className={cn(
                          "mx-2 h-4 w-4",
                          selectedValue === item.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.type}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
