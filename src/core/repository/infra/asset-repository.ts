import { api } from "@/core/http-client/AxiosClient";
import { Asset } from "@/core/model/infra/asset";
import { AddAssetPayload } from "@/core/payload/infra/add-asset-payload";
import { UpdateAssetPayload } from "@/core/payload/infra/update-asset-payload";

const baseUrl: string = "/asset";

const getAllAssets = async (queryParam: {
    propertyId?: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<BaseResponse<Asset[]>> => {
    queryParam.search = queryParam.search?.trim() || undefined;
    const propertyId = queryParam.propertyId;
    delete queryParam.propertyId;
    const response = await api.get(`${baseUrl}/all/${propertyId}`, { params: queryParam });
    return response.data;
};

const getAssetById = async (id: number): Promise<BaseResponse<Asset | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};

const getAllAssetsNoPaging = async (propertyId: number): Promise<BaseResponse<Asset[]>> => {
    const response = await api.get(`${baseUrl}/no-paging/${propertyId}`);
    return response.data;
};

const createAsset = async (request: AddAssetPayload): Promise<BaseResponse<Asset>> => {
    const response = await api.post(`${baseUrl}`, request);
    return response.data;
};

const updateAsset = async (id: number, request: UpdateAssetPayload): Promise<BaseResponse<Asset>> => {
    const response = await api.put(`${baseUrl}/${id}`, request);
    return response.data;
};

const deleteAsset = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
};

export const assetRepository = {
    getAllAssets,
    getAssetById,
    getAllAssetsNoPaging,
    createAsset,
    updateAsset,
    deleteAsset,
};
