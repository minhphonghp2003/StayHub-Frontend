import axios, { AxiosInstance } from 'axios';
import { authInterceptor } from './interceptor/AuthInterceptor';
import { errorInterceptor } from './interceptor/ErrorInterceptor';

// Singleton instance
let axiosInstance: AxiosInstance | null = null;
const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7074/api',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,

    });

    instance.interceptors.request.use(
        authInterceptor,
    );

    instance.interceptors.response.use(
        (response) => {
            // treat API-level failure flag as an error so callers (and toastPromise) can handle it
            const data = response?.data as any;
            if (data && typeof data.success !== 'undefined' && data.success === false) {
                const msg = data.message || data.error || 'Request failed';
                return Promise.reject(new Error(msg));
            }
            return response;
        },
        errorInterceptor
    );

    return instance;
};

// Export the singleton instance
export const api: AxiosInstance = axiosInstance ?? (axiosInstance = createAxiosInstance());
