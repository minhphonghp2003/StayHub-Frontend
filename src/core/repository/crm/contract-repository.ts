import { api } from "@/core/http-client/AxiosClient";
import { BaseResponse } from "@/core/model/BaseResponse";
import { Contract } from "@/core/model/crm/contract";
import { AddContractPayload } from "@/core/payload/crm/add-contract-payload";
import { UpdateContractPayload } from "@/core/payload/crm/update-contract-payload";

const baseUrl = "/contract";

const getContractById = async (id: number): Promise<BaseResponse<Contract | null>> => {
    const response = await api.request({
        url: `${baseUrl}/${id}`,
        method: "GET",
    });
    return response.data;
};

const getAllContracts = async (params: {
    propertyId: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<BaseResponse<Contract[]>> => {
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

const createContract = async (payload: AddContractPayload): Promise<BaseResponse<boolean>> => {
    const response = await api.request({
        url: baseUrl,
        method: "POST",
        data: payload,
    });
    return response.data;
};

const updateContract = async (id: number, payload: UpdateContractPayload): Promise<BaseResponse<Contract>> => {
    const response = await api.request({
        url: `${baseUrl}/${id}`,
        method: "PUT",
        data: payload,
    });
    return response.data;
};

const deleteContract = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.request({
        url: `${baseUrl}/${id}`,
        method: "DELETE",
    });
    return response.data;
};

export const contractRepository = {
    getContractById,
    getAllContracts,
    createContract,
    updateContract,
    deleteContract,
};
