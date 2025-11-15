import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select"
import Label from "@/components/form/Label";
interface Option {
  value: any;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  name?: string,
  label?: string
}

const CustomSelect: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  name,
  label
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(String(defaultValue));

  const handleChange = (value: string) => {
    setSelectedValue(value.toString());
    const option = options.find((o) => String(o.value) === value);
    if (option) {
      onChange?.(option.value);
    }
  };

  return (
    <div className="w-full">
      {
        label && <Label>{label}</Label>
      }
      <Select name={name} value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" className="z-[999999]">
          <SelectGroup>
            {
              label && <SelectLabel>{label ?? ""}</SelectLabel>
            }
            {options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>{option.label}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )

};

export default CustomSelect;
