import { api } from "@/core/http-client/AxiosClient";
import { AuthModel } from "@/core/model/RBAC/Auth";
import { LoginPayload } from "@/core/payload/RBAC/login-payload";
import { ChangePasswordPayload, ChangeTenantPasswordPayload, ForgetPasswordPayload, NewPasswordPayload } from "@/core/payload/RBAC/password-payload";
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
const revokeAllToken = async ({ userId }: { userId: number }): Promise<BaseResponse<boolean>> => {
    const response = await api.post(`${baseUrl}/revoke-all-token/${userId}`);
    return response.data;
};

const register = async (payload: RegisterPayload): Promise<BaseResponse<AuthModel>> => {
    const response = await api.post(`${baseUrl}/register`, payload);
    return response.data;
};
const forgetPassword = async (payload: ForgetPasswordPayload): Promise<BaseResponse<number>> => {
    // Returns int based on: IRequest<BaseResponse<int>>
    const response = await api.post(`${baseUrl}/forget-password`, payload);
    return response.data;
};

const newPassword = async (payload: NewPasswordPayload): Promise<BaseResponse<boolean>> => {
    // Returns bool based on: IRequest<BaseResponse<bool>>
    const response = await api.post(`${baseUrl}/new-password`, payload);
    return response.data;
};

const changePassword = async (payload: ChangePasswordPayload): Promise<BaseResponse<boolean>> => {
    // Returns bool based on: IRequest<BaseResponse<bool>>
    const response = await api.post(`${baseUrl}/change-password`, payload);
    return response.data;
};

const changeTenantPassword = async (payload: ChangeTenantPasswordPayload): Promise<BaseResponse<boolean>> => {
    // Returns bool based on: IRequest<BaseResponse<bool>>
    const response = await api.post(`${baseUrl}/change-tenant-password`, payload);
    return response.data;
};
export default {
    login, logout, register,
    forgetPassword, newPassword, changePassword,
    changeTenantPassword,
    revokeAllToken
};