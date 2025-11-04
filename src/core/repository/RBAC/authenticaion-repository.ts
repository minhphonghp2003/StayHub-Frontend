import { AuthModel } from "@/core/model/RBAC/auth";
import { BaseRepository } from "../base-repository";
import { LoginPayload } from "@/core/payload/RBAC/login-payload";

export class AuthenticationRepository extends BaseRepository<AuthModel,AuthenticationRepository> {
    baseUrl: string = '/RBAC/auth';
    
    async login({ username, password }: LoginPayload): Promise<AuthModel> {
        const response = await this.client.post<AuthModel>(`${this.baseUrl}/login`, {
            username,
            password,
        });
        return response.data;
    }

}
