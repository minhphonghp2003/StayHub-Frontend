import { api } from "@/core/http-client/AxiosClient";
import { User } from "@/core/model/RBAC/User"; // Assuming Employee uses the User model or similar

const baseUrl: string = '/employee'; // Adjust this if your API route prefix is different

const createEmployee = async (payload: any): Promise<BaseResponse<boolean>> => {
    const response = await api.post(`${baseUrl}`, payload);
    return response.data;
};

const getAllEmployees = async ({ propertyId, pageNumber, pageSize, searchKey }: any): Promise<BaseResponse<User[]>> => {
    const params = {
        pageNumber,
        pageSize,
        searchKey: searchKey?.trim() || undefined
    };
    const response = await api.get(`${baseUrl}/${propertyId}`, { params });
    return response.data;
};

const updateEmployee = async (propertyId: number, id: number, payload: any): Promise<BaseResponse<boolean>> => {
    const response = await api.put(`${baseUrl}/${propertyId}/user/${id}`, payload);
    return response.data;
};

const deleteEmployee = async (propertyId: number, id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${propertyId}/user/${id}`);
    return response.data;
};

const getAllEmployeesNoPaging = async (propertyId: number): Promise<BaseResponse<User[]>> => {
    const response = await api.get(`${baseUrl}/no-paging/${propertyId}`);
    return response.data;
};

export default {
    createEmployee,
    getAllEmployees,
    getAllEmployeesNoPaging,
    updateEmployee,
    deleteEmployee
};