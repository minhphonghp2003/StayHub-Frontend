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
        // ✅ Client side
        return localStorage.getItem(accessTokenKey || "access_token") || undefined;
    } else {
        // ✅ Server side (Next.js App Router only)
        try {
            const { cookies } = await import('next/headers');
            return (await cookies()).get(accessTokenKey || "access_token")?.value;
        } catch {
            // Probably not in server context (e.g., Pages Router)
            return undefined;
        }
    }
};

const isBrowser = typeof window !== 'undefined';
const accessTokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN
