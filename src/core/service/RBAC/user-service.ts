import { Profile } from "@/core/model/RBAC/profile"
import { Role } from "@/core/model/RBAC/Role"
import { User } from "@/core/model/RBAC/User"
import { UpdateProfilePayload } from "@/core/payload/RBAC/update-profile-payload"
import userRepository from "@/core/repository/RBAC/user-repository"

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
const getProfileById = async (id: number): Promise<Profile | null> => {
    const result = await userRepository.getProfileById(id);
    return result.success ? result.data ?? null : null;
};
const getMyProfile = async (): Promise<Profile | null> => {
    const result = await userRepository.getMyProfile();
    return result.success ? result.data ?? null : null;
};
const setActivateUser = async (id: number, activated: boolean): Promise<boolean | null> => {
    const result = await userRepository.setActivateUser(id, activated);
    return result.success ? result.data ?? null : null;
};
const getUserOfRole = async (id: number, params: any, signal: any): Promise<{ data: User[], pageInfo?: PageInfo } | null> => {
    var result = await userRepository.getUserOfRole({ ...params, id, signal })
    if (result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result
        };
    }
    return null;
};
const assignRoleToUser = async (userId: number, roleIds: number[]): Promise<any> => {
    return await userRepository.assignRoleToUser(roleIds, userId)
}
const updateProfile = async (userId: number, payload: UpdateProfilePayload): Promise<BaseResponse<Profile>> => {
    return await userRepository.updateProfile(userId, payload)
}

const getRoleOfUser = async (userId: number): Promise<Role[] | null> => {
    const result = await userRepository.getRoleOfUser({ id: userId });
    return result.success ? result.data ?? null : null;
};

export default {
    getAllUsers,
    getUserById,
    getProfileById,
    getMyProfile,
    updateProfile,
    setActivateUser,
    getUserOfRole,
    assignRoleToUser,
    getRoleOfUser
};