import { AuthModel } from "@/core/model/RBAC/Auth";
import { LoginPayload } from "@/core/payload/RBAC/login-payload";
import { RegisterPayload } from "@/core/payload/RBAC/register-payload";
import authRepository from "@/core/repository/RBAC/authentication-repository";
import { removeAuthInfo, setAuthInfo } from "./token-service";

const login = async ({ username, password }: LoginPayload): Promise<BaseResponse<AuthModel>> => {
    var result = await authRepository.login({ username, password })
    if (result.success && result.data?.token) {
        setAuthInfo(result.data)
    }
    return result;
}
const logout = async (): Promise<BaseResponse<boolean>> => {
    const stored = localStorage.getItem('user');
    const refreshToken = stored ? (JSON.parse(stored) as AuthModel).refreshToken : "";
    const result = await authRepository.logout({ refreshToken: refreshToken });
    removeAuthInfo()

    return result;
}
const register = async (payload: RegisterPayload): Promise<BaseResponse<AuthModel>> => {
    var result = await authRepository.register(payload)
    if (result.success && result.data?.token) {
        setAuthInfo(result.data)
    }
    return result;
}
export default {
    login, logout, register
};
