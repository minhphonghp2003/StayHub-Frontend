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
