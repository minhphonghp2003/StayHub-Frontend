import { Tier } from "@/core/model/tier/tier";
import { AddTierPayload } from "@/core/payload/tier/add-tier-payload";
import { UpdateTierPayload } from "@/core/payload/tier/update-tier-payload";
import { tierRepository } from "@/core/repository/tier/tier-repository";

const getAllTiers = async ({ pageNumber, pageSize, search }: any): Promise<{ data: Tier[]; pageInfo: PageInfo } | null> => {
    const result = await tierRepository.getAllTiers({ pageNumber, pageSize, search });
    if (result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result ?? null,
        };
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

export const tierService = {
    getAllTiers,
    getTierById,
    createTier,
    updateTier,
    deleteTier,
};
