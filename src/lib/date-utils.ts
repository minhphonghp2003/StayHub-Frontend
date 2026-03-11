// src/lib/date-utils.ts

/**
 * Parse an ISO date string as UTC and return a local Date object.
 */
export function parseUTCToLocal(dateString?: string | null): Date | undefined {
    if (!dateString) return undefined;
    // Parse as UTC, then convert to local time
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
}

/**
 * Convert a local Date object to an ISO string in UTC (for API payloads).
 */
export function localToUTCISOString(date?: Date | null): string | undefined {
    if (!date) return undefined;
    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    )).toISOString();
}

/**
 * Format a date for display (local time).
 */
export function formatLocalDate(date?: Date | null, options?: Intl.DateTimeFormatOptions): string {
    if (!date) return '';
    return date.toLocaleString('vi-VN', options);
}
