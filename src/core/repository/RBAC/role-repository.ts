import { api } from "@/core/http-client/AxiosClient";
import { Role } from "@/core/model/RBAC/Role";
import { RolePayload } from "@/core/payload/RBAC/role-payload";

const baseUrl: string = '/role';

const getAllRole = async (): Promise<BaseResponse<Role[]>> => {

    const response = await api.get(`${baseUrl}`);
    return response.data;
};

const getRoleById = async (id: number): Promise<BaseResponse<Role | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};

const createRole = async (request: RolePayload): Promise<BaseResponse<Role>> => {
    const response = await api.post(`${baseUrl}`, request);
    return response.data;
};

const updateRole = async (id: number, request: RolePayload): Promise<BaseResponse<Role>> => {
    const response = await api.put(`${baseUrl}/${id}`, request);
    return response.data;
};

const deleteRole = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
};

export default {
    getAllRole,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
};