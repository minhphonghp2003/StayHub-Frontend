import Label from "@/components/form/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/shadcn/select";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Control, Controller } from "react-hook-form";

interface Option {
  value: any;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  className?: string;
  value?: any;
  name?: string;
  label?: string;
  required?: boolean;
}



interface FormSelectProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options: Option[];
  onChange?: (value?: any | undefined) => void;
  disabled?: boolean;
  allowClear?: boolean;
}


export function FormSelect({
  name,
  control,
  label,
  placeholder = "Select an option",
  required,
  options,
  onChange,
  disabled,
  allowClear = true,
}: FormSelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="w-full space-y-1">
          {label && (
            <Label>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
          )}

          <div className="relative">
            <Select
              value={field.value ?? ""}
              onValueChange={(value) => {
                field.onChange(value);
                onChange?.(value);
              }}
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  "w-full pr-9", // space for suffix button
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent className="z-[999999]">
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {allowClear && field.value && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  field.onChange(undefined);
                  onChange?.(undefined);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2
                           rounded-sm p-1 text-muted-foreground
                           hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    />
  );
}


