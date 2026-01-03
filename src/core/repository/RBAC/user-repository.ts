import { api } from "@/core/http-client/AxiosClient";
import { User } from "@/core/model/RBAC/User";

const baseUrl: string = '/user';

const getAllUser = async ({ search, pageNumber, pageSize, menuGroupId }: any): Promise<BaseResponse<User[]>> => {

    const params = {
        search: search?.trim() || undefined,
        pageNumber,
        pageSize,
        menuGroupId
    };
    const response = await api.get(`${baseUrl}`, { params });
    return response.data;
};

const getUserById = async (id: number): Promise<BaseResponse<User | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};


const setActivateUser = async (id: number, activated: boolean): Promise<BaseResponse<boolean>> => {
    const response = await api.patch(`${baseUrl}/set-activated/${id}`, null, {
        params: { activated }
    });
    return response.data;
};


export default {
    getAllUser,
    getUserById,
    setActivateUser,
};