import { CategoryItem } from "@/core/model/catalog/category-item";
import { Role } from "@/core/model/RBAC/Role";
import { RolePayload } from "@/core/payload/RBAC/role-payload";
import roleRepository from "@/core/repository/RBAC/role-repository";

const getAllRoles = async (): Promise<Role[]> => {
    var result = await roleRepository.getAllRole()
    if (result.success) {
        return result.data ?? [];
    }
    return [];
}

const getroleById = async (id: number): Promise<Role | null> => {
    const result = await roleRepository.getRoleById(id);
    return result.success ? result.data ?? null : null;
};

const createrole = async (command: RolePayload): Promise<Role | string | null> => {
    const result = await roleRepository.createRole(command);
    return result.success ? result.data ?? null : result.message ?? null;
};

const updaterole = async (id: number, command: RolePayload): Promise<Role | null> => {
    const result = await roleRepository.updateRole(id, command);
    return result.success ? result.data ?? null : null;
};

const deleterole = async (id: number): Promise<boolean | null> => {
    const result = await roleRepository.deleteRole(id);
    return result.success ? result.data ?? null : null;
};

export default {
    getAllRoles,
    getroleById,
    createrole,
    updaterole,
    deleterole
};