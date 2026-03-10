import { api } from "@/core/http-client/AxiosClient";
import { BaseResponse } from "@/core/model/BaseResponse";
import { Customer } from "@/core/model/crm/customer";
import { AddCustomerPayload } from "@/core/payload/crm/add-customer-payload";
import { UpdateCustomerPayload } from "@/core/payload/crm/update-customer-payload";

const baseUrl = "/customer";

const getCustomerById = async (id: number): Promise<BaseResponse<Customer | null>> => {
    const response = await api.request({
        url: `${baseUrl}/${id}`,
        method: "GET",
    });
    return response.data;
};

const getAllCustomers = async (params: {
    propertyId: number;
    isWalkin?: boolean;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<BaseResponse<Customer[]>> => {
    const response = await api.request({
        url: `${baseUrl}/all/${params.propertyId}`,
        method: "GET",
        params: {
            isWalkin: params.isWalkin,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            search: params.search,
        },
    });
    return response.data;
};

const getAllCustomersNoPaging = async (propertyId: number, isWalkin?: boolean): Promise<BaseResponse<Customer[]>> => {
    const response = await api.request({
        url: `${baseUrl}/no-paging/${propertyId}`,
        method: "GET",
        params: {
            isWalkin,
        },
    });
    return response.data;
};

const createCustomer = async (payload: AddCustomerPayload): Promise<BaseResponse<boolean>> => {
    const response = await api.request({
        url: baseUrl,
        method: "POST",
        data: payload,
    });
    return response.data;
};

const updateCustomer = async (id: number, payload: UpdateCustomerPayload): Promise<BaseResponse<Customer>> => {
    const response = await api.request({
        url: `${baseUrl}/${id}`,
        method: "PUT",
        data: payload,
    });
    return response.data;
};

const deleteCustomer = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.request({
        url: `${baseUrl}/${id}`,
        method: "DELETE",
    });
    return response.data;
};

export const customerRepository = {
    getCustomerById,
    getAllCustomers,
    getAllCustomersNoPaging,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};
