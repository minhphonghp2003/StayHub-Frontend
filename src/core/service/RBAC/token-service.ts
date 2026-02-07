import { AuthModel } from "@/core/model/RBAC/Auth";

const removeAuthInfo = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh');
    // Clear cookies on client side
    if (typeof document !== "undefined") {
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
}
const setAuthInfo = async (info: AuthModel) => {
    localStorage.setItem('user', JSON.stringify(info));
    localStorage.setItem('access_token', info.token);
    localStorage.setItem('refresh', info.refreshToken);
    localStorage.setItem('expiresDate', info.expiresDate);
    
    // Also set cookies for server-side access
    if (typeof document !== "undefined") {
        const oneDay = 30 * 24 * 60 * 60 * 1000; // 30 days
        const expiryDate = new Date(Date.now() + oneDay).toUTCString();
        document.cookie = `access_token=${encodeURIComponent(info.token)}; path=/; expires=${expiryDate}; SameSite=Lax`;
        document.cookie = `refresh_token=${encodeURIComponent(info.refreshToken)}; path=/; expires=${expiryDate}; SameSite=Lax`;
    }
}
const getAuthInfo = () => {
    let userStr = localStorage.getItem('user');
    let access_token = localStorage.getItem('access_token');
    let refresh = localStorage.getItem('refresh',);
    let expiresDate = localStorage.getItem('expiresDate');
    const user = userStr ? JSON.parse(userStr) : null;
    return {
        user, access_token, refresh, expiresDate
    }
}
const decodeJWT = (token: string) => {
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Invalid JWT:", e);
        return null;
    }
}

const isJWTExpired = (token: string) => {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true; // assume expired if invalid

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
}

export { getAuthInfo, isJWTExpired, removeAuthInfo, setAuthInfo };

