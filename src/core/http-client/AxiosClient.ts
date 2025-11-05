import axios, { AxiosError, AxiosInstance } from 'axios';
import { authInterceptor } from './interceptor/AuthInterceptor';
import { errorInterceptor } from './interceptor/ErrorInterceptor';

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

    instance.interceptors.request.use(
        authInterceptor,
    );

    instance.interceptors.response.use(
        (response) => response,
        errorInterceptor
    );

    return instance;
};

// Export the singleton instance
export const api: AxiosInstance = axiosInstance ?? (axiosInstance = createAxiosInstance());
