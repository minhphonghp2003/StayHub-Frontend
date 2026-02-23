import { api } from "@/core/http-client/AxiosClient";
import { Property } from "@/core/model/pmm/property";
import { AddPropertyPayload } from "@/core/payload/pmm/add-property-payload";
import { UpdatePropertyPayload } from "@/core/payload/pmm/update-property-payload";

const baseUrl: string = "/property";

const getAllProperties = async (queryParam: { pageNumber?: number; pageSize?: number; search?: string }): Promise<BaseResponse<Property[]>> => {
    queryParam.search = queryParam.search?.trim() || undefined;
    const response = await api.get(`${baseUrl}`, { params: queryParam });
    return response.data;
};

const getPropertyById = async (id: number): Promise<BaseResponse<Property | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};

const createProperty = async (request: AddPropertyPayload): Promise<BaseResponse<Property>> => {
    const response = await api.post(`${baseUrl}`, request);
    return response.data;
};

const updateProperty = async (id: number, request: UpdatePropertyPayload): Promise<BaseResponse<Property>> => {
    const response = await api.put(`${baseUrl}/${id}`, request);
    return response.data;
};

const deleteProperty = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
};

const getMyProperties = async (): Promise<BaseResponse<Property[]>> => {
    const response = await api.get(`${baseUrl}/my`);
    return response.data;
};

export const propertyRepository = {
    getAllProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getMyProperties,
};
