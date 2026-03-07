import { Asset } from "@/core/model/infra/asset";
import { AddAssetPayload } from "@/core/payload/infra/add-asset-payload";
import { UpdateAssetPayload } from "@/core/payload/infra/update-asset-payload";
import { assetRepository } from "@/core/repository/infra/asset-repository";

const getAllAssets = async ({
    propertyId,
    pageNumber,
    pageSize,
    search,
}: {
    propertyId: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<{ data: Asset[]; pageInfo: PageInfo } | null> => {
    const result = await assetRepository.getAllAssets({
        propertyId,
        pageNumber,
        pageSize,
        search,
    });
    if (result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result ?? null,
        };
    }
    return null;
};

const getAssetById = async (id: number): Promise<Asset | null> => {
    const result = await assetRepository.getAssetById(id);
    return result.success ? result.data ?? null : null;
};

const getAllAssetsNoPaging = async (propertyId: number): Promise<Asset[]> => {
    const result = await assetRepository.getAllAssetsNoPaging(propertyId);
    return result.success ? result.data ?? [] : [];
};

const createAsset = async (payload: AddAssetPayload): Promise<Asset | null> => {
    const result = await assetRepository.createAsset(payload);
    return result.success ? result.data ?? null : null;
};

const updateAsset = async (id: number, payload: UpdateAssetPayload): Promise<Asset | null> => {
    const result = await assetRepository.updateAsset(id, payload);
    return result.success ? result.data ?? null : null;
};

const deleteAsset = async (id: number): Promise<boolean> => {
    const result = await assetRepository.deleteAsset(id);
    return result.data ?? false;
};

export const assetService = {
    getAllAssets,
    getAssetById,
    getAllAssetsNoPaging,
    createAsset,
    updateAsset,
    deleteAsset,
};
