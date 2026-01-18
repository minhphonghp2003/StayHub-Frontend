import { api } from "@/core/http-client/AxiosClient";
import { User } from "@/core/model/RBAC/User";

const baseUrl: string = '/user';

const userRoleUrl: string = '/UserRole';
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

const getUserOfRole = async ({ pageNumber, pageSize, id, signal }: any): Promise<BaseResponse<User[]>> => {
    const params = {
        pageNumber,
        pageSize,
    };
    const response = await api.get(`${userRoleUrl}/user-of-role/${id}`, { params, signal });
    return response?.data ?? null;
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
    getUserOfRole
};