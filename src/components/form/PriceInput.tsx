import { forwardRef, useState, useEffect, InputHTMLAttributes } from "react";
import Label from "@/components/form/Label";

interface PriceInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    label?: string;
    hint?: string;
    error?: boolean;
    success?: boolean;
    required?: boolean;
    value?: number;
    onChange?: (value: number) => void;
}

const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>((props, ref) => {
    const {
        label,
        hint,
        error = false,
        success = false,
        required = false,
        value,
        onChange,
        className = "",
        ...rest
    } = props;

    const [displayValue, setDisplayValue] = useState("");

    // Format number to Vietnamese style with dots
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Parse Vietnamese formatted string back to number
    const parseNumber = (str: string): number => {
        return parseInt(str.replace(/\./g, "")) || 0;
    };

    // Update display value when value prop changes
    useEffect(() => {
        if (value !== undefined && value !== null) {
            setDisplayValue(formatNumber(value));
        } else {
            setDisplayValue("");
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow only numbers and dots
        const cleanValue = inputValue.replace(/[^\d.]/g, "");

        // Remove existing dots and reformat
        const numericValue = cleanValue.replace(/\./g, "");
        const formattedValue = numericValue ? formatNumber(parseInt(numericValue)) : "";

        setDisplayValue(formattedValue);

        // Call onChange with numeric value
        if (onChange) {
            onChange(parseNumber(formattedValue));
        }
    };

    // Base input styles
    let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-black dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

    if (error) inputClasses += " border-error-500 text-error-800 focus:ring-error-500/10 dark:border-error-500 dark:text-error-400";
    else if (success) inputClasses += " border-success-400 text-success-500 focus:ring-success-500/10 dark:border-success-500 dark:text-success-400";
    else inputClasses += " bg-transparent border-gray-300 text-gray-800 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-black dark:text-white/90 dark:focus:border-brand-800";

    return (
        <div className="relative w-full">
            {label && (
                <Label>
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
            )}

            <div className="relative">
                <input
                    ref={ref}
                    type="text"
                    className={inputClasses}
                    value={displayValue}
                    onChange={handleInputChange}
                    {...rest}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 text-sm">
                    VND
                </div>
            </div>

            {hint && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
            )}
        </div>
    );
});

PriceInput.displayName = "PriceInput";

export default PriceInput;
