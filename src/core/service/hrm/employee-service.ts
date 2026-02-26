import { User } from "@/core/model/RBAC/User";
import employeeRepository from "@/core/repository/hrm/employee-repository";

const createEmployee = async (payload: any): Promise<boolean | null> => {
    const result = await employeeRepository.createEmployee(payload);
    return result.success ? result.data ?? null : null;
};

const getAllEmployees = async (propertyId: number, params: any): Promise<{ data: User[], pageInfo?: PageInfo } | null> => {
    const result = await employeeRepository.getAllEmployees({ propertyId, ...params });
    if (result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result // Maps the pagination info just like in user-service.ts
        };
    }
    return null;
};

const updateEmployee = async (propertyId: number, id: number, payload: any): Promise<boolean | null> => {
    const result = await employeeRepository.updateEmployee(propertyId, id, payload);
    return result.success ? result.data ?? null : null;
};

const deleteEmployee = async (propertyId: number, id: number): Promise<boolean | null> => {
    const result = await employeeRepository.deleteEmployee(propertyId, id);
    return result.success ? result.data ?? null : null;
};

export default {
    createEmployee,
    getAllEmployees,
    updateEmployee,
    deleteEmployee
};