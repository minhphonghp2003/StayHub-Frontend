import { AuthModel } from "@/core/model/RBAC/auth";
import { LoginPayload } from "@/core/payload/RBAC/LoginPayload";
import { RegisterPayload } from "@/core/payload/RBAC/RegisterPayload";
import authRepository from "@/core/repository/RBAC/AuthenticationRepository";

const login = async ({ username, password }: LoginPayload): Promise<BaseResponse<AuthModel>> => {
    var result = await authRepository.login({ username, password })
    if (result.success && result.data?.token) {
        localStorage.setItem('user', JSON.stringify(result.data));
    }
    return result;
}
const logout = async (): Promise<BaseResponse<boolean>> => {
    const stored = localStorage.getItem('user');
    const refreshToken = stored ? (JSON.parse(stored) as AuthModel).refreshToken : "";
    const result = await authRepository.logout({ refreshToken: refreshToken });
    if (result.success) {
        localStorage.removeItem('user');
    }
    return result;
}
const register = async (payload: RegisterPayload): Promise<BaseResponse<AuthModel>> => {
    var result = await authRepository.register(payload)
    if (result.success && result.data?.token) {
        localStorage.setItem('user', JSON.stringify(result.data));
    }
    return result;
}
export default {
    login, logout, register
};
