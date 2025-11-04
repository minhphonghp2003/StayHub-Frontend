import { AuthModel } from "@/core/model/RBAC/auth";
import { LoginPayload } from "@/core/payload/RBAC/login-payload";
import authRepository from "@/core/repository/RBAC/authenticaion-repository";

const login = async ({ username, password }: LoginPayload): Promise<AuthModel> => {
    return authRepository.login({ username, password });
}

export default {
    login,
};
