import { AuthModel } from "@/core/model/RBAC/auth";
import { LoginPayload } from "@/core/payload/RBAC/login-payload";
import authRepository from "@/core/repository/RBAC/authenticaion-repository";

const login = async ({ username, password }: LoginPayload): Promise<BaseResponse<AuthModel>> => {
    var result = await authRepository.login({ username, password })
    if (result.success && result.data?.token) {
        localStorage.setItem('user', JSON.stringify(result.data));
    }
    return result;
}

export default {
    login,
};
