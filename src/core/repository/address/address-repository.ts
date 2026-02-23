import { api } from "@/core/http-client/AxiosClient";
import { Province, Ward } from "@/core/model/address/address";
import { AddProvincePayload } from "@/core/payload/address/add-province-payload";
import { AddWardPayload } from "@/core/payload/address/add-ward-payload";
import { UpdateProvincePayload } from "@/core/payload/address/update-province-payload";
import { UpdateWardPayload } from "@/core/payload/address/update-ward-payload";

const baseUrl: string = "/address";

// Province operations
const getAllProvinces = async (): Promise<BaseResponse<Province[]>> => {
    const response = await api.get(`${baseUrl}/province`);
    return response.data;
};

const getProvinceById = async (id: number): Promise<BaseResponse<Province | null>> => {
    const response = await api.get(`${baseUrl}/province/${id}`);
    return response.data;
};

const createProvince = async (request: AddProvincePayload): Promise<BaseResponse<Province>> => {
    const response = await api.post(`${baseUrl}/province`, request);
    return response.data;
};

const updateProvince = async (id: number, request: UpdateProvincePayload): Promise<BaseResponse<Province>> => {
    const response = await api.put(`${baseUrl}/province/${id}`, request);
    return response.data;
};

const deleteProvince = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/province/${id}`);
    return response.data;
};

// Ward operations
const getAllWards = async (): Promise<BaseResponse<Ward[]>> => {
    const response = await api.get(`${baseUrl}/ward`);
    return response.data;
};

const getWardById = async (id: number): Promise<BaseResponse<Ward | null>> => {
    const response = await api.get(`${baseUrl}/ward/${id}`);
    return response.data;
};

const createWard = async (request: AddWardPayload): Promise<BaseResponse<Ward>> => {
    const response = await api.post(`${baseUrl}/ward`, request);
    return response.data;
};

const updateWard = async (id: number, request: UpdateWardPayload): Promise<BaseResponse<Ward>> => {
    const response = await api.put(`${baseUrl}/ward/${id}`, request);
    return response.data;
};

const deleteWard = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/ward/${id}`);
    return response.data;
};

export const addressRepository = {
    // Province
    getAllProvinces,
    getProvinceById,
    createProvince,
    updateProvince,
    deleteProvince,
    // Ward
    getAllWards,
    getWardById,
    createWard,
    updateWard,
    deleteWard,
};
