import { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export const authInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};
const getToken = async (): Promise<string | undefined> => {
    if (isBrowser) {

        const match = document.cookie.match(new RegExp(`(^| )${accessTokenKey || "access_token"}=([^;]+)`));
        return match ? match[2] : undefined;
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
