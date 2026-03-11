// src/core/model/date-convert.ts
import { parseUTCToLocal, localToUTCISOString } from "@/lib/date-utils";

/**
 * Convert all date fields in a model from API (UTC string) to local Date.
 * Extend this for each model as needed.
 */
export function parseTierFromApi(data: any) {
    return {
        ...data,
        createdAt: parseUTCToLocal(data.createdAt),
        updatedAt: parseUTCToLocal(data.updatedAt),
    };
}

export function parsePropertyFromApi(data: any) {
    return {
        ...data,
        createdAt: parseUTCToLocal(data.createdAt),
        updatedAt: parseUTCToLocal(data.updatedAt),
        startSubscriptionDate: parseUTCToLocal(data.startSubscriptionDate),
        endSubscriptionDate: parseUTCToLocal(data.endSubscriptionDate),
    };
}

export function parseContractFromApi(data: any) {
    return {
        ...data,
        createdAt: parseUTCToLocal(data.createdAt),
        updatedAt: parseUTCToLocal(data.updatedAt),
        startDate: parseUTCToLocal(data.startDate),
        endDate: parseUTCToLocal(data.endDate),
        depositRemainEndDate: parseUTCToLocal(data.depositRemainEndDate),
    };
}

export function parseCustomerFromApi(data: any) {
    return {
        ...data,
        createdAt: parseUTCToLocal(data.createdAt),
        updatedAt: parseUTCToLocal(data.updatedAt),
        dateOfBirth: parseUTCToLocal(data.dateOfBirth),
    };
}

// Add more as needed for other models.

/**
 * Convert model to payload for API (local Date -> UTC ISO string)
 */
export function contractToPayload(data: any) {
    return {
        ...data,
        startDate: localToUTCISOString(data.startDate),
        endDate: localToUTCISOString(data.endDate),
        depositRemainEndDate: localToUTCISOString(data.depositRemainEndDate),
    };
}

export function customerToPayload(data: any) {
    return {
        ...data,
        dateOfBirth: localToUTCISOString(data.dateOfBirth),
    };
}

// Add more as needed for other payloads.
