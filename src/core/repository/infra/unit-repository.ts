import { api } from "@/core/http-client/AxiosClient";
import { Unit } from "@/core/model/infra/unit";
import { AddUnitPayload } from "@/core/payload/infra/add-unit-payload";
import { UpdateUnitPayload } from "@/core/payload/infra/update-unit-payload";

const baseUrl: string = "/unit";

const getAllUnits = async (queryParam: {
    propertyId?: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<BaseResponse<Unit[]>> => {
    queryParam.search = queryParam.search?.trim() || undefined;
    const propertyId = queryParam.propertyId;
    delete queryParam.propertyId; // move propertyId to url param, not query param
    const response = await api.get(`${baseUrl}/all/${propertyId}`, { params: queryParam });
    return response.data;
};

const getUnitById = async (id: number): Promise<BaseResponse<Unit | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};

const createUnit = async (
    request: AddUnitPayload
): Promise<BaseResponse<Unit>> => {
    const response = await api.post(`${baseUrl}`, request);
    return response.data;
};

const updateUnit = async (
    id: number,
    request: UpdateUnitPayload
): Promise<BaseResponse<Unit>> => {
    const response = await api.put(`${baseUrl}/${id}`, request);
    return response.data;
};

const deleteUnit = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
};

// note: backend expects "isActivate" as a query parameter rather than in the request body
const setActivation = async (unitId: number, isActivate: boolean): Promise<BaseResponse<boolean>> => {
    const response = await api.patch(
        `${baseUrl}/activate/${unitId}`,
        null,
        { params: { isActivate } }
    );
    return response.data;
};

const getAllUnitsNoPaging = async (propertyId: number): Promise<BaseResponse<Unit[]>> => {
    const response = await api.get(`${baseUrl}/no-paging/${propertyId}`);
    return response.data;
};

export const unitRepository = {
    getAllUnits,
    getUnitById,
    getAllUnitsNoPaging,
    createUnit,
    updateUnit,
    deleteUnit,
    setActivation,
};