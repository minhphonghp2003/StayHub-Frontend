import { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export const errorInterceptor = async (error: AxiosError): Promise<AxiosError> => {
    const status = error.response?.status;

    console.log(error);

    switch (status) {
        case 400:
            console.warn('[Axios] Bad Request:', error.response?.data);
            break;
        case 401:
            console.warn('[Axios] Unauthorized — token may be expired');
            // Optionally refresh token or redirect to login
            // if (isBrowser) {
            //     localStorage.removeItem('access_token');
            //     window.location.href = '/login';
            // }
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
};


const isBrowser = typeof window !== 'undefined';
