import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Vietnamese } from 'flatpickr/dist/l10n/vn.js';
import { useEffect } from 'react';
import { localToUTCISOString } from '@/lib/date-utils';
import { CalenderIcon } from '../../icons';
import Label from './Label';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  required,
  error
}: PropsType) {
  useEffect(() => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (!input) return;

    const flatPickr = flatpickr(input, {
      mode: mode || "single",
      monthSelectorType: "static",
      locale: {
        ...Vietnamese,
        firstDayOfWeek: 1,
      },
      dateFormat: "d-m-Y",
      defaultDate,
      appendTo: typeof document !== 'undefined' ? document.body : undefined,
      onOpen: function (selectedDates, dateStr, instance) {
        try {
          if (instance && instance.calendarContainer) {
            instance.calendarContainer.style.zIndex = '200000';
          }
        } catch (e) {
          // ignore
        }
      },
      onChange: (selectedDates, dateStr, instance) => {
        const emitValue = mode === 'single' && selectedDates[0]
          ? localToUTCISOString(selectedDates[0])
          : selectedDates.map(localToUTCISOString);
        if (onChange) {
          if (Array.isArray(onChange)) {
            onChange.forEach(fn => fn(emitValue, dateStr, instance));
          } else {
            onChange(emitValue, dateStr, instance);
          }
        }
      },
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate]);

  return (
    <div className='w-full'>
      {label && <Label htmlFor={id}>{label} {required && <span className="text-red-500">*</span>}</Label>}

      <div className="relative ">
        <input
          id={id}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-black dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800 ${error ? 'border-red-500 focus:ring-red-500/10' : ''}`}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
