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
  required?: boolean
}

const CustomSelect: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  name,
  label,
  required
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue ? String(defaultValue) : undefined);

  const handleChange = (value: string | undefined) => {
    if (value === "__clear") {
      setSelectedValue(undefined); // clear selection
    } else {
      setSelectedValue(value);
    }
    const option = options.find((o) => String(o.value) === value);
    if (option) {
      onChange?.(option.value);
    }
  };

  return (
    <div className="w-full">
      {

        label && <Label>{label} <span className={`${required ? "text-red-500" : "hidden"}`}>*</span></Label>
      }
      <Select required={required} name={name} value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" className="z-[999999]">
          <SelectGroup>
            <SelectItem
              value="__clear"
              className="text-red-500"
            >
              Xóa lựa chọn
            </SelectItem>
            {/* <SelectLabel className="cursor-pointer" onClick={() => { handleChange(undefined) }}>Xóa lựa chọn</SelectLabel> */}
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
