import { api } from "@/core/http-client/AxiosClient";
import { BaseResponse } from "@/core/model/BaseResponse";
import { Vehicle } from "@/core/model/crm/vehicle";
import { AddVehiclePayload } from "@/core/payload/crm/add-vehicle-payload";
import { UpdateVehiclePayload } from "@/core/payload/crm/update-vehicle-payload";

const baseUrl = "/vehicle";

const getVehicleById = async (id: number): Promise<BaseResponse<Vehicle | null>> => {
    const response = await api.request({
        url: `${baseUrl}/${id}`,
        method: "GET",
    });
    return response.data;
};

const getAllVehicles = async (params: {
    propertyId: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<BaseResponse<Vehicle[]>> => {
    const response = await api.request({
        url: `${baseUrl}/all/${params.propertyId}`,
        method: "GET",
        params: {
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            search: params.search,
        },
    });
    return response.data;
};

const getAllVehiclesNoPaging = async (customerId: number): Promise<BaseResponse<Vehicle[]>> => {
    const response = await api.request({
        url: `${baseUrl}/no-paging/${customerId}`,
        method: "GET",
    });
    return response.data;
};

const createVehicle = async (payload: AddVehiclePayload): Promise<BaseResponse<boolean>> => {
    const response = await api.request({
        url: baseUrl,
        method: "POST",
        data: payload,
    });
    return response.data;
};

const updateVehicle = async (id: number, payload: UpdateVehiclePayload): Promise<BaseResponse<Vehicle>> => {
    const response = await api.request({
        url: `${baseUrl}/${id}`,
        method: "PUT",
        data: payload,
    });
    return response.data;
};

const deleteVehicle = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.request({
        url: `${baseUrl}/${id}`,
        method: "DELETE",
    });
    return response.data;
};

export const vehicleRepository = {
    getVehicleById,
    getAllVehicles,
    getAllVehiclesNoPaging,
    createVehicle,
    updateVehicle,
    deleteVehicle,
};
