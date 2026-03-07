import { api } from "@/core/http-client/AxiosClient";
import { UnitGroup } from "@/core/model/infra/unitGroup";
import { AddUnitGroupPayload } from "@/core/payload/infra/add-unitGroup-payload";
import { UpdateUnitGroupPayload } from "@/core/payload/infra/update-unitGroup-payload";

const baseUrl: string = "/unitGroup";

const getAllUnitGroups = async (queryParam: {
    propertyId?: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<BaseResponse<UnitGroup[]>> => {
    queryParam.search = queryParam.search?.trim() || undefined;
    const propertyId = queryParam.propertyId;
    delete queryParam.propertyId; // move propertyId to url param, not query param
    const response = await api.get(`${baseUrl}/all/${propertyId}`, { params: queryParam });
    return response.data;
};

const getAllUnitGroupsNoPaging = async (propertyId: number): Promise<BaseResponse<UnitGroup[]>> => {
    const response = await api.get(`${baseUrl}/no-paging/${propertyId}`);
    return response.data;
};

const getUnitGroupById = async (id: number): Promise<BaseResponse<UnitGroup | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};

const createUnitGroup = async (
    request: AddUnitGroupPayload
): Promise<BaseResponse<UnitGroup>> => {
    const response = await api.post(`${baseUrl}`, request);
    return response.data;
};

const updateUnitGroup = async (
    id: number,
    request: UpdateUnitGroupPayload
): Promise<BaseResponse<UnitGroup>> => {
    const response = await api.put(`${baseUrl}/${id}`, request);
    return response.data;
};

const deleteUnitGroup = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
};

export const unitGroupRepository = {
    getAllUnitGroups,
    getAllUnitGroupsNoPaging,
    getUnitGroupById,
    createUnitGroup,
    updateUnitGroup,
    deleteUnitGroup,
};
