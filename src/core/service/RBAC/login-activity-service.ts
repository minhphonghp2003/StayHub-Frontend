import { loginActivityRepository } from "@/core/repository/RBAC/login-activity-repository";

const getMyLoginHistory = async (page: number = 1, size: number = 10) => {
    return await loginActivityRepository.getMyActivities({ 
        pageNumber: page, 
        pageSize: size 
    });
}

const getUserLoginHistory = async (userId: number, page: number = 1, size: number = 10) => {
    return await loginActivityRepository.getUserActivities(userId, { 
        pageNumber: page, 
        pageSize: size 
    });
}

export const loginActivityService = {
    getMyLoginHistory,
    getUserLoginHistory
};