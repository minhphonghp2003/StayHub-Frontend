import { api } from "@/core/http-client/AxiosClient";
import { Service } from "@/core/model/infra/service";
import { AddServicePayload } from "@/core/payload/infra/add-service-payload";
import { UpdateServicePayload } from "@/core/payload/infra/update-service-payload";

const baseUrl: string = "/service";

const getAllServices = async (queryParam: {
    propertyId?: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<BaseResponse<Service[]>> => {
    queryParam.search = queryParam.search?.trim() || undefined;
    const propertyId = queryParam.propertyId;
    delete queryParam.propertyId; // move propertyId to url param, not query param
    const response = await api.get(`${baseUrl}/all/${propertyId}`, { params: queryParam });
    return response.data;
};

const getServiceById = async (id: number): Promise<BaseResponse<Service | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};

const createService = async (
    request: AddServicePayload
): Promise<BaseResponse<Service>> => {
    const response = await api.post(`${baseUrl}`, request);
    return response.data;
};

const updateService = async (
    id: number,
    request: UpdateServicePayload
): Promise<BaseResponse<Service>> => {
    const response = await api.put(`${baseUrl}/${id}`, request);
    return response.data;
};

const deleteService = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
};

const setActivateService = async (id: number, isActivate: boolean): Promise<BaseResponse<boolean>> => {
    const response = await api.patch(`${baseUrl}/activate/${id}`, { isActivate });
    return response.data;
};

export const serviceRepository = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    setActivateService,
};