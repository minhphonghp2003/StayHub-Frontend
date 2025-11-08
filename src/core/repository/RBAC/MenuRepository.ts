import { api } from "@/core/http-client/AxiosClient";
import { Menu, MenuGroup } from "@/core/model/RBAC/Menu";

const baseUrl: string = '/menu';
const getMyMenus = async (): Promise<BaseResponse<MenuGroup[]>> => {
    const response = await api.get(`${baseUrl}/my`);
    return response.data;
};
const getAllMenu = async (): Promise<BaseResponse<Menu[]>> => {
    const response = await api.get(`${baseUrl}`);
    return response.data;
};
export default {
    getMyMenus, getAllMenu
};