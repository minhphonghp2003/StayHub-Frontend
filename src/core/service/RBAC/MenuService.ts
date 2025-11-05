import { Menu } from "@/core/model/RBAC/Menu";
import menuRepository from "@/core/repository/RBAC/MenuRepository";

const getMyMenus = async (): Promise<Menu[]> => {
    var result = await menuRepository.getMyMenus()
    if (result.success) {
        return result.data ?? [];
    }
    return [];
}
export default {
    getMyMenus
};