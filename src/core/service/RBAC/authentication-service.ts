import { AuthModel } from "@/core/model/RBAC/auth";
import { LoginPayload } from "@/core/payload/RBAC/login-payload";
import authRepository from "@/core/repository/RBAC/authenticaion-repository";

const login = async ({ username, password }: LoginPayload):Promise<BaseResponse<AuthModel>> => {
    var result = await authRepository.login({ username, password })
    return result;
}

export default {
    login,
};
