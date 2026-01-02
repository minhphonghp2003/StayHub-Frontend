import { api } from "@/core/http-client/AxiosClient";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { Action } from "@/core/model/RBAC/Action";

const baseUrl: string = '/action';

const getAllAction = async ({ search, pageNumber, pageSize, menuGroupId }: any): Promise<BaseResponse<Action[]>> => {

    const params = {
        search: search?.trim() || undefined,
        pageNumber,
        pageSize,
        menuGroupId
    };
    const response = await api.get(`${baseUrl}`, { params });
    return response.data;
};
const generateAction = async (): Promise<BaseResponse<boolean>> => {
    const response = await api.post(`${baseUrl}/generate`);
    return response.data;
};
const allowAnonAction = async (id: number, allow: boolean): Promise<BaseResponse<boolean>> => {
    const response = await api.patch(`${baseUrl}/allow-anonymous/${id}`, null, {
        params: { allow }
    });
    return response.data;
};


export default {
    getAllAction,
    generateAction,
    allowAnonAction

};