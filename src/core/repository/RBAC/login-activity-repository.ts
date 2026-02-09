import { api } from "@/core/http-client/AxiosClient";
import { LoginActivity } from "@/core/model/RBAC/login-activity"; // The model we defined earlier

// Define the shape of the query parameters
export interface ActivityQueryParams {
    pageNumber?: number;
    pageSize?: number;
}

const controllerPath = "/LoginActivity"; // Matches the C# Controller Name

/**
 * Get login activity for the currently logged-in user
 * Endpoint: GET /api/LoginActivity/my
 */
const getMyActivities = async (params?: ActivityQueryParams): Promise<BaseResponse<LoginActivity[]>> => {
    const response = await api.get(`${controllerPath}/my`, { 
        params: params 
    });
    return response.data;
};

/**
 * Get login activity for a specific user (Admin usage)
 * Endpoint: GET /api/LoginActivity/{id}
 */
const getUserActivities = async (userId: number, params?: ActivityQueryParams): Promise<BaseResponse<LoginActivity[]>> => {
    const response = await api.get(`${controllerPath}/${userId}`, { 
        params: params 
    });
    return response.data;
};

// Export the repository
export const loginActivityRepository = {
    getMyActivities,
    getUserActivities
};