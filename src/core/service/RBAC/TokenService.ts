import { AuthModel } from "@/core/model/RBAC/auth";

const removeAuthInfo = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh');
}
const setAuthInfo = async (info: AuthModel) => {
    localStorage.setItem('user', JSON.stringify(info));
    localStorage.setItem('access_token', info.token);
    localStorage.setItem('refresh', info.refreshToken);
}
const getAuthInfo = () => {
    let userStr = localStorage.getItem('user');
    let access_token = localStorage.getItem('access_token');
    let refresh = localStorage.getItem('refresh',);

    const user = userStr ? JSON.parse(userStr) : null;
    return {
        user, access_token, refresh
    }
}
export {
    removeAuthInfo, setAuthInfo, getAuthInfo
}