import { Action } from "@/core/model/RBAC/Action";
import { Tier } from "@/core/model/tier/tier";
import { AddTierPayload } from "@/core/payload/tier/add-tier-payload";
import { UpdateTierPayload } from "@/core/payload/tier/update-tier-payload";
import { tierRepository } from "@/core/repository/tier/tier-repository";

const getAllTiers = async (): Promise<Tier[] | null> => {
    const result = await tierRepository.getAllTiers();
    if (result.success) {
        return result.data ?? [];
    }
    return null;
};

const getTierById = async (id: number): Promise<Tier | null> => {
    const result = await tierRepository.getTierById(id);
    return result.success ? (result.data ?? null) : null;
};

const createTier = async (payload: AddTierPayload): Promise<Tier | null> => {
    const result = await tierRepository.createTier(payload);
    return result.success ? (result.data ?? null) : null;
};

const updateTier = async (id: number, payload: UpdateTierPayload): Promise<Tier | null> => {
    const result = await tierRepository.updateTier(id, payload);
    return result.success ? (result.data ?? null) : null;
};

const deleteTier = async (id: number): Promise<boolean> => {
    const result = await tierRepository.deleteTier(id);
    return result.data ?? false;
};

const getActionOfTier = async (id: number, signal: any): Promise<Action[]> => {
    const result = await tierRepository.getActionOfTier(id, signal);
    if (result?.success) {
        return result.data ?? [];
    }
    return [];
};

const assignActionsToTier = async (actionIds: number[], tierId: number): Promise<number[]> => {
    const result = await tierRepository.assignActionsToTier(actionIds, tierId);
    if (result.success) {
        return result.data ?? [];
    }
    return [];
};

const getMenusOfTier = async (id: number, signal: any): Promise<number[]> => {
    const result = await tierRepository.getMenuOfTier(id, signal);
    if (result?.success) {
        return result.data ?? [];
    }
    return [];
};

const assignMenusToTier = async (menuIds: number[], tierId: number): Promise<number[]> => {
    const result = await tierRepository.assignMenusToTier(menuIds, tierId);
    if (result.success) {
        return result.data ?? [];
    }
    return [];
};

export const tierService = {
    getAllTiers,
    getTierById,
    createTier,
    updateTier,
    deleteTier,
    getActionOfTier,
    assignActionsToTier,
    getMenusOfTier,
    assignMenusToTier,
};
