import Label from "@/components/form/Label";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  suffix?: ReactNode;
  error?: boolean;
  success?: boolean;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    label,
    hint,
    suffix,
    error = false,
    success = false,
    required = false,
    className = "",
    ...rest
  } = props;

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

      <input
        ref={ref}           // important for RHF
        className={inputClasses}
        {...rest}           // includes onChange, value, name, placeholder from RHF
      />

      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {suffix}
        </div>
      )}

      {hint && (
        <p className={`mt-1.5 text-xs ${error ? "text-error-500" : success ? "text-success-500" : "text-gray-500"}`}>
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
