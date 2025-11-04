import axios, { AxiosError, AxiosInstance } from 'axios';

const isBrowser = typeof window !== 'undefined';
const accessTokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN

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

// Singleton instance
let axiosInstance: AxiosInstance | null = null;

const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7047/api',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });

    // 🧩 REQUEST INTERCEPTOR
    instance.interceptors.request.use(
        async (config) => {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                delete config.headers.Authorization;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 🔥 RESPONSE (ERROR) INTERCEPTOR
    instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const status = error.response?.status;

            // 🧱 Handle common HTTP errors
            switch (status) {
                case 400:
                    console.warn('[Axios] Bad Request:', error.response?.data);
                    break;
                case 401:
                    console.warn('[Axios] Unauthorized — token may be expired');
                    // Optionally refresh token or redirect to login
                    if (isBrowser) {
                        localStorage.removeItem('access_token');
                        window.location.href = '/login';
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

            // 🧩 Normalize error for UI consumption
            const customError = {
                status,
                message:
                    (error.response?.data as any)?.message ||
                    error.message ||
                    'Unknown error occurred',
                data: error.response?.data,
            };

            return Promise.reject(customError);
        }
    );

    return instance;
};

// Export the singleton instance
export const api: AxiosInstance = axiosInstance ?? (axiosInstance = createAxiosInstance());
