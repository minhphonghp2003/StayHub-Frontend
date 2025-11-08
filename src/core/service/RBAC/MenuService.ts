import { Menu, MenuGroup } from "@/core/model/RBAC/Menu";
import menuRepository from "@/core/repository/RBAC/MenuRepository";

const getMyMenus = async (): Promise<MenuGroup[]> => {
    var result = await menuRepository.getMyMenus()
    if (result.success) {
        return result.data ?? [];
    }
    return [];
}
const getAllMenus = async (): Promise<Menu[]> => {
    var result = await menuRepository.getAllMenu()
    if (result.success) {
        return result.data ?? [];
    }
    return [];
}
export default {
    getMyMenus, getAllMenus
};