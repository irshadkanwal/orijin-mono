import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Label } from "../ui/label";
import { PlusCircle, SearchIcon } from "lucide-react";

export const CustomSelect = ({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: any[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter options based on the search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid gap-2">
      <Label className="capitalize" htmlFor={id}>
        {`Chose ${id}`}
      </Label>
      <Select onValueChange={onChange} value={value} disabled={false}>
        <SelectTrigger
          id={id}
          className="w-[270px] h-10 border rounded flex items-center pl-5 pr-5 pt-3 pb-3 font-semibold hover:bg-[#F0F4F8] transition-colors"
        >
          <span className="pr-2">
            <PlusCircle size={18} />
          
          </span>
          {value ? value : `Please select ${id}`}
        </SelectTrigger>
        <SelectContent position="popper" className="bg-white rounded">
          <div className="flex items-center mb-2 mt-2">
            <SearchIcon size={18} className="mr-2 text-gray-500" />
            <input
              type="text"
              className="w-full h-8 rounded px-2 font-bold"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="h-[1px] bg-[#F0F4F8]" />
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <SelectItem key={option} value={option}>
                <div
                  className={`w-full h-10 flex items-center rounded px-4 cursor-pointer
                  ${value === option ? "bg-[#E0E7FF]" : "hover:bg-[#F0F4F8]"} transition-colors`}
                >
                  <span>{option}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled value="">
              <div className="w-full flex justify-center px-4">
                No options found
              </div>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
