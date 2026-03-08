import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseOptionalNumber(value: FormDataEntryValue | null | undefined): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
}

export function formatVND(amount: number | undefined | null): string {
  if (amount === null || amount === undefined || isNaN(amount)) return "-";
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
/**
 * Formats a date string to DD/MM/YYYY (Vietnamese standard)
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "-";

  // Using 'en-GB' or 'vi-VN' results in DD/MM/YYYY
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formats a date string to DD/MM/YYYY HH:mm (Vietnamese standard)
 */
export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "-";

  const d = date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const t = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Vietnam typically uses 24h format in tech/admin
  });

  return `${d} ${t}`;
}