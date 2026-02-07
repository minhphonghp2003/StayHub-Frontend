import { api } from "@/core/http-client/AxiosClient";
import { Profile } from "@/core/model/RBAC/profile";
import { Role } from "@/core/model/RBAC/Role";
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
const getRoleOfUser = async ({ id }: any): Promise<BaseResponse<Role[]>> => {

    const response = await api.get(`${userRoleUrl}/role-of-user/${id}`);
    return response?.data ?? null;
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
const getProfileById = async (id: number): Promise<BaseResponse<Profile | null>> => {
    const response = await api.get(`${baseUrl}/profile/${id}`);
    return response.data;
}

const getMyProfile = async (): Promise<BaseResponse<Profile | null>> => {
    const response = await api.get(`${baseUrl}/my-profile`);
    return response.data;
};
const assignRoleToUser = async (roleIds: number[], userId: number): Promise<BaseResponse<number[]>> => {
    const payload = {
        roleIds, userId
    };
    const response = await api.post(`${userRoleUrl}/user/assignRole`, payload);
    return response.data;
};
export default {
    getAllUser,
    getUserById,
    setActivateUser,
    getProfileById,
    getMyProfile,
    assignRoleToUser,
    getRoleOfUser,
    getUserOfRole

};