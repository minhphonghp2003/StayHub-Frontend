import { api } from "@/core/http-client/AxiosClient";
import { Tier } from "@/core/model/tier/tier";
import { AddTierPayload } from "@/core/payload/tier/add-tier-payload";
import { UpdateTierPayload } from "@/core/payload/tier/update-tier-payload";

const baseUrl: string = "/tier";

const getAllTiers = async (): Promise<BaseResponse<Tier[]>> => {
    const response = await api.get(`${baseUrl}`);
    return response.data;
};

const getTierById = async (id: number): Promise<BaseResponse<Tier | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};

const createTier = async (request: AddTierPayload): Promise<BaseResponse<Tier>> => {
    const response = await api.post(`${baseUrl}`, request);
    return response.data;
};

const updateTier = async (id: number, request: UpdateTierPayload): Promise<BaseResponse<Tier>> => {
    const response = await api.put(`${baseUrl}/${id}`, request);
    return response.data;
};

const deleteTier = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
};

export const tierRepository = {
    getAllTiers,
    getTierById,
    createTier,
    updateTier,
    deleteTier,
};
