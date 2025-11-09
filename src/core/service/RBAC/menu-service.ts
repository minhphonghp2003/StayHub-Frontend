import { Menu, MenuGroup } from "@/core/model/RBAC/Menu";
import { AddMenuPayload } from "@/core/payload/RBAC/add-menu-payload";
import { UpdateMenuPayload } from "@/core/payload/RBAC/udpate-menu-payload";
import menuRepository from "@/core/repository/RBAC/menu-repository";

const getMyMenus = async (): Promise<MenuGroup[]> => {
    var result = await menuRepository.getMyMenus()
    if (result.success) {
        return result.data ?? [];
    }
    return [];
}
const getAllMenus = async (params: any): Promise<{ data: Menu[], pageInfo?: PageInfo } | null> => {
    var result = await menuRepository.getAllMenu({ params })
    if (result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result
        };
    }
    return null;
}

const getMenuById = async (id: number): Promise<Menu | null> => {
    const result = await menuRepository.getMenuById(id);
    return result.success ? result.data ?? null : null;
};

const createMenu = async (command: AddMenuPayload): Promise<Menu | null> => {
    const result = await menuRepository.createMenu(command);
    return result.success ? result.data ?? null : null;
};

const updateMenu = async (id: number, command: UpdateMenuPayload): Promise<Menu | null> => {
    const result = await menuRepository.updateMenu(id, command);
    return result.success ? result.data ?? null : null;
};

const setActivateMenu = async (id: number, activated: boolean): Promise<boolean | null> => {
    const result = await menuRepository.setActivateMenu(id, activated);
    return result.success ? result.data ?? null : null;
};

const deleteMenu = async (id: number): Promise<boolean | null> => {
    const result = await menuRepository.deleteMenu(id);
    return result.success ? result.data ?? null : null;
};

export default {
    getMyMenus,
    getAllMenus,
    getMenuById,
    createMenu,
    updateMenu,
    setActivateMenu,
    deleteMenu
};