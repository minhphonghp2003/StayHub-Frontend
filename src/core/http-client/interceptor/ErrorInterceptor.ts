import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { api } from "../AxiosClient";
import AuthenticationService from "@/core/service/RBAC/AuthenticationService";
import { getAuthInfo, removeAuthInfo, setAuthInfo } from "@/core/service/RBAC/TokenService";
import { AuthModel } from "@/core/model/RBAC/Auth";

export const errorInterceptor = async (error: any) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    switch (status) {
        case 400:
            console.warn('[Axios] Bad Request:', error.response?.data);
            break;
        case 401:
            try {
                const refreshToken = await getRefreshToken()
                if (refreshToken == null) {
                    await removeToken()
                    window.location.href = '/signin';
                    return Promise.reject();
                }
                let result = await postRefreshToken(refreshToken);
                if (!result) {
                    await removeToken()
                    window.location.href = '/signin';
                    return Promise.reject();
                }

                return api(originalRequest);
            } catch (refreshError) {

                window.location.href = '/signin';
                return Promise.reject(refreshError);
            }
            break;
        case 403:
            console.warn('[Axios] Forbidden — no permission');
            break;
        case 404:
            console.warn('[Axios] Not Found:', error.config?.url);
            break;
        case 500:
            console.error('[Axios] Server Error:', error.response?.data);
            break;
        default:
            console.error('[Axios] Unknown Error:', error.message);
            break;
    }

    const customError = {
        status,
        message:
            (error.response?.data as any)?.message ||
            error.message ||
            'Unknown error occurred',
        data: error.response?.data,
    };

    return Promise.reject(customError);
};

const getRefreshToken = async (): Promise<string | undefined> => {
    if (isBrowser) {
        return (getAuthInfo()).refresh || undefined;
    } else {
        try {
            const { cookies } = await import('next/headers');
            return (await cookies()).get(refreshToken || "refresh")?.value;
        } catch {
            return undefined;
        }
    }
};

const removeToken = async () => {
    if (isBrowser) {
        await removeAuthInfo();
        // Optional: remove browser cookies manually if you set tokens as cookies
        document.cookie = "access_token=; Max-Age=0; path=/; SameSite=Lax;";
        document.cookie = "refresh=; Max-Age=0; path=/; SameSite=Lax;";
    } else {
        const { cookies } = await import('next/headers');
        let cookieStore = await cookies();
        cookieStore.delete(accessToken || "access_token")
        cookieStore.delete(refreshToken || "refresh")
        return (await cookies()).get(refreshToken || "refresh")?.value;
    }
}

const postRefreshToken = async (token: string): Promise<AuthModel | null> => {
    try {

        let client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7047/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        const response = await client.post(`${process.env.NEXT_PUBLIC_API_URL}/token/refresh-token`, {
            token,
        });
        let result = response.data;
        if (result.success) {
            setAuthInfo(result.data)
            return result.data;
        } else {
            return null;
        }
    } catch {
        return null;
    }

}

const isBrowser = typeof window !== 'undefined';
const refreshToken = process.env.NEXT_PUBLIC_REFRESH_TOKEN
const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN
