import { api } from "@/core/http-client/AxiosClient";
import { Action } from "@/core/model/RBAC/Action";
import { Menu } from "@/core/model/RBAC/Menu";
import { Role } from "@/core/model/RBAC/Role";
import { RolePayload } from "@/core/payload/RBAC/role-payload";

const baseUrl: string = '/role';
const roleActionUrl: string = '/RoleAction';
const roleMenuUrl: string = '/RoleMenu';
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
const assignActionsToRole = async (actionIds: number[], roleId: number): Promise<BaseResponse<number[]>> => {
    const payload = {
        actionIds,
        roleId
    };
    const response = await api.post(`${roleActionUrl}/role/assign-action`, payload);
    return response.data;
};
const getActionOfRole = async (id: number, signal: any): Promise<BaseResponse<Action[]>> => {
    const response = await api.get(`${roleActionUrl}/action-of-role/${id}`, { signal });
    return response?.data ?? null;
};
const assignMenusToRole = async (menuIds: number[], roleId: number): Promise<BaseResponse<number[]>> => {
    const payload = {
        menuIds,
        roleId
    };
    const response = await api.post(`${roleMenuUrl}/role/assign-menu`, payload);
    return response.data;
};
const getMenuOfRole = async (id: number, signal: any): Promise<BaseResponse<number[]>> => {
    const response = await api.get(`${roleMenuUrl}/menu-of-role/${id}`, { signal });
    return response?.data ?? null;
};
export default {
    getAllRole,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    assignActionsToRole,
    getActionOfRole,
    assignMenusToRole,
    getMenuOfRole
};