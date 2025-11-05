import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { api } from "../AxiosClient";
import { AuthModel } from "@/core/model/RBAC/auth";
import AuthenticationService from "@/core/service/RBAC/AuthenticationService";

export const errorInterceptor = async (error: any) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    // TODO 401 handler
    switch (status) {
        case 400:
            console.warn('[Axios] Bad Request:', error.response?.data);
            break;
        case 401:
            try {
                const refreshToken = await getRefreshToken()
                if (refreshToken == null) {
                    await AuthenticationService.logout();
                    window.location.href = '/login';
                    return Promise.reject();
                }
                let result = await postRefreshToken(refreshToken);
                if (!result) {
                    await AuthenticationService.logout();
                    window.location.href = '/login'; 
                    return Promise.reject();
                }

                return api(originalRequest);
            } catch (refreshError) {

                window.location.href = '/login';
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

        const match = document.cookie.match(new RegExp(`(^| )${"refresh"}=([^;]+)`));
        return match ? match[2] : undefined;
    } else {

        try {
            const { cookies } = await import('next/headers');
            return (await cookies()).get("refresh")?.value;
        } catch {
            return undefined;
        }
    }
};

const postRefreshToken = async (token: string): Promise<AuthModel | null> => {
    try {

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/token/refresh-token`, {
            token,
        });
        let result = response.data;
        if (result.success) {
            return result.data;
        } else {
            return null;
        }
    } catch {
        return null;
    }
    return null;

}

const isBrowser = typeof window !== 'undefined';
