import { CategoryItem } from "@/core/model/catalog/category-item";
import { User } from "@/core/model/RBAC/User";
import userRepository from "@/core/repository/RBAC/user-repository";

const getAllUsers = async (params: any): Promise<{ data: User[], pageInfo?: PageInfo } | null> => {
    var result = await userRepository.getAllUser(params)
    if (result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result
        };
    }
    return null;
}
const getUserById = async (id: number): Promise<User | null> => {
    const result = await userRepository.getUserById(id);
    return result.success ? result.data ?? null : null;
};

const setActivateUser = async (id: number, activated: boolean): Promise<boolean | null> => {
    const result = await userRepository.setActivateUser(id, activated);
    return result.success ? result.data ?? null : null;
};

export default {
    getAllUsers,
    getUserById,
    setActivateUser,
};