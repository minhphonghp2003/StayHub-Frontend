import { api } from "@/core/http-client/AxiosClient";
import { Menu, MenuGroup } from "@/core/model/RBAC/Menu";
import { AddMenuPayload } from "@/core/payload/RBAC/add-menu-payload";
import { UpdateMenuPayload } from "@/core/payload/RBAC/udpate-menu-payload";

const baseUrl: string = '/menu';
const getMyMenus = async (): Promise<BaseResponse<MenuGroup[]>> => {
    const response = await api.get(`${baseUrl}/my`);
    return response.data;
};
const getAllMenu = async ({ search, pageNumber, pageSize, menuGroupId }: any): Promise<BaseResponse<Menu[]>> => {

    const params = {
        search: search?.trim() || undefined,
        pageNumber,
        pageSize,
        menuGroupId
    };
    const response = await api.get(`${baseUrl}`, { params });
    return response.data;
};

const getMenuById = async (id: number): Promise<BaseResponse<Menu | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};

const createMenu = async (request: AddMenuPayload): Promise<BaseResponse<Menu>> => {
    const response = await api.post(`${baseUrl}`, request);
    return response.data;
};

const updateMenu = async (id: number, request: UpdateMenuPayload): Promise<BaseResponse<Menu>> => {
    const response = await api.put(`${baseUrl}/${id}`, request);
    return response.data;
};

const setActivateMenu = async (id: number, activated: boolean): Promise<BaseResponse<boolean>> => {
    const response = await api.patch(`${baseUrl}/set-activated/${id}`, null, {
        params: { activated }
    });
    return response.data;
};

const deleteMenu = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
};

export default {
    getMyMenus,
    getAllMenu,
    getMenuById,
    createMenu,
    updateMenu,
    setActivateMenu,
    deleteMenu
};