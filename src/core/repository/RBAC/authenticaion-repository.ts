import { AuthModel } from "@/core/model/RBAC/auth";
import { LoginPayload } from "@/core/payload/RBAC/login-payload";

const baseUrl: string = '/RBAC/auth';

const login = async ({ username, password }: LoginPayload): Promise<AuthModel> => {
    const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }
    return response.json();
};
// export const authRepository = {
//     login,
// };
export default {
    login,
};