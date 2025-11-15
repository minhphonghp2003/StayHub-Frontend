import Label from "@/components/form/Label";
import { Button } from "@/components/ui/shadcn/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { forwardRef, useState } from "react";

interface Option {
  value: any;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: any) => void;
  className?: string;
  defaultValue?: any;
  name?: string;
  label?: string;
  required?: boolean;
}

// Forward ref to support RHF
const CustomSelect = forwardRef<HTMLDivElement, CustomSelectProps>(({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue,
  name,
  label,
  required = false,
}, ref) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    defaultValue !== undefined ? String(defaultValue) : undefined
  );
  const [key, setKey] = useState(+new Date()); // force re-render to reset value

  const handleChange = (value: string) => {
    if (value === "__clear") {
      setSelectedValue(undefined);
      onChange?.(undefined);
    } else {
      setSelectedValue(value);
      const option = options.find((o) => String(o.value) === value);
      onChange?.(option?.value);
    }
  };

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Select
        key={key}
        name={name}
        required={required}
        value={selectedValue}
        onValueChange={handleChange}
      >
        <SelectTrigger className={`w-full ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent position="popper" className="z-[999999]">
          <SelectGroup>
            {label && <SelectLabel>{label}</SelectLabel>}
            {options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>

          <SelectSeparator />

          {selectedValue && (
            <Button
              className="w-full px-2"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleChange("__clear");
                setKey(+new Date()); // reset select
              }}
            >
              Xóa
            </Button>
          )}
        </SelectContent>
      </Select>
    </div>
  );
});

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;

