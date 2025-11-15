import { api } from "@/core/http-client/AxiosClient";
import { AuthModel } from "@/core/model/RBAC/Auth";
import { LoginPayload } from "@/core/payload/RBAC/login-payload";
import { RegisterPayload } from "@/core/payload/RBAC/register-payload";

const baseUrl: string = '/auth';

const login = async ({ username, password }: LoginPayload): Promise<BaseResponse<AuthModel>> => {
    const response = await api.post(`${baseUrl}/login`, { username, password });
    return response.data;
};

const logout = async ({ refreshToken }: { refreshToken: string }): Promise<BaseResponse<boolean>> => {
    const response = await api.post(`${baseUrl}/logout`, { refreshToken });
    return response.data;
};

const register = async (payload: RegisterPayload): Promise<BaseResponse<AuthModel>> => {
    const response = await api.post(`${baseUrl}/register`, payload);
    return response.data;
};
export default {
    login, logout, register
};