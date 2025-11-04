import { AuthModel } from "@/core/model/RBAC/auth";
import { LoginPayload } from "@/core/payload/RBAC/login-payload";
import { api } from "@/core/http-client/axios-client";

const baseUrl: string = '/auth';

const login = async ({ username, password }: LoginPayload) => {
    const response = await api.post(`${baseUrl}/login`, { username, password });
    return response.data;
};
export default {
    login,
};