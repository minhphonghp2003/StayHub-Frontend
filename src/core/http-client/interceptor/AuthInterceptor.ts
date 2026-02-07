import { getAuthInfo } from "@/core/service/RBAC/token-service";
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
        try {
            // Client-side: read from localStorage (fastest)
            const auth = getAuthInfo();
            if (auth?.access_token) {
                return auth.access_token;
            }

            // Fallback: try to read from document.cookie (non-HttpOnly cookies)
            if (typeof document !== "undefined" && document.cookie) {
                const cookieName = parseCookieName(accessTokenKey || "access_token");
                const match = document.cookie.split("; ").find((c) => c.startsWith(`${cookieName}=`));
                if (match) {
                    return decodeURIComponent(match.split("=")[1] || "");
                }
            }
        } catch (e) {
            console.error("[AuthInterceptor] Client token read error:", e);
        }
        return undefined;
    } else {
        // Server-side: read from request cookies
        try {
            const mod = await import("next/headers");
            const cookieStore = typeof mod.cookies === "function" ? await mod.cookies() : undefined;
            if (!cookieStore) {
                return undefined;
            }
            const cookieName = parseCookieName(accessTokenKey || "access_token");
            return cookieStore.get(cookieName)?.value;
        } catch (e) {
            return undefined;
        }
    }
};

const parseCookieName = (name: string): string => {
    let cleanName = name.trim();
    if (cleanName.startsWith('"') && cleanName.endsWith('"')) {
        cleanName = cleanName.slice(1, -1);
    }
    return cleanName;
};

const isBrowser = typeof window !== 'undefined';
const accessTokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN;


