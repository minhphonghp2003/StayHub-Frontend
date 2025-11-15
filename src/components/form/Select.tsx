import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select"
import Label from "@/components/form/Label";
import { X } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
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
  const [key, setKey] = React.useState(+new Date())

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
      <Select key={key} required={required} name={name} value={selectedValue} onValueChange={handleChange}>

        <SelectTrigger >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" className="z-[999999]">
          <SelectGroup>
            {label && <SelectLabel>{label ?? ""}</SelectLabel>}
            {options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>{option.label}</SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          {
            selectedValue && <Button
              className="w-full px-2"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedValue(undefined)
                setKey(+new Date())
              }}
            >
              Xóa
            </Button>
          }
        </SelectContent>
      </Select>
    </div>
  )

};

export default CustomSelect;
