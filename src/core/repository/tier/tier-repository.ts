import { api } from "@/core/http-client/AxiosClient";
import { Action } from "@/core/model/RBAC/Action";
import { Tier } from "@/core/model/tier/tier";
import { AddTierPayload } from "@/core/payload/tier/add-tier-payload";
import { AssignActionsToTierPayload } from "@/core/payload/tier/assign-actions-to-tier-payload";
import { AssignMenusToTierPayload } from "@/core/payload/tier/assign-menus-to-tier-payload";
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

const assignActionsToTier = async (actionIds: number[], tierId: number): Promise<BaseResponse<number[]>> => {
    const payload: AssignActionsToTierPayload = {
        tierId,
        actionIds,
    };
    const response = await api.post(`${baseUrl}/assign-action`, payload);
    return response.data;
};

const getActionOfTier = async (id: number, signal: any): Promise<BaseResponse<Action[]>> => {
    const response = await api.get(`${baseUrl}/action-of-tier/${id}`, { signal });
    return response?.data ?? null;
};

const assignMenusToTier = async (menuIds: number[], tierId: number): Promise<BaseResponse<number[]>> => {
    const payload: AssignMenusToTierPayload = {
        tierId,
        menuIds,
    };
    const response = await api.post(`${baseUrl}/assign-menu`, payload);
    return response.data;
};

const getMenuOfTier = async (id: number, signal: any): Promise<BaseResponse<number[]>> => {
    const response = await api.get(`${baseUrl}/menu-of-tier/${id}`, { signal });
    return response?.data ?? null;
};

export const tierRepository = {
    getAllTiers,
    getTierById,
    createTier,
    updateTier,
    deleteTier,
    assignActionsToTier,
    getActionOfTier,
    assignMenusToTier,
    getMenuOfTier,
};
