import { api } from "@/core/http-client/AxiosClient";
import { Menu } from "@/core/model/RBAC/Menu";

const baseUrl: string = '/menu';
const getMyMenus = async (): Promise<BaseResponse<Menu[]>> => {
    const response = await api.get(`${baseUrl}/my`);
    return response.data;
};

export default {
    getMyMenus
};