import { LoginPayload } from "@/core/payload/RBAC/login-payload";
import { AuthenticationRepository } from "@/core/repository/RBAC/authenticaion-repository";

export class AuthenticationService {
    authRepository: AuthenticationRepository;

    constructor() {
        this.authRepository = new AuthenticationRepository();
    }
    async login({ username, password }: LoginPayload) {
        return this.authRepository.login({ username, password });
    }
}