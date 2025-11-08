import { getAuthInfo } from "@/core/service/RBAC/TokenService";
import { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import Cookies from 'js-cookie';
// TODO cookie and local storage not sync
export const authInterceptor = async (config: any) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};
const getToken = async (): Promise<string | undefined> => {
    if (isBrowser) {
        return (getAuthInfo()).access_token || undefined;
    } else {
        try {
            const { cookies } = await import('next/headers');
            return (await cookies()).get(accessTokenKey || "access_token")?.value;
        } catch {
            return undefined;
        }
    }
};

const isBrowser = typeof window !== 'undefined';
const accessTokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN


