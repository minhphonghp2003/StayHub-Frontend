import { api } from "@/core/http-client/AxiosClient";
import { Category } from "@/core/model/catalog/category";
import { AddCategoryPayload } from "@/core/payload/catalog/add-category-payload";
import { UpdateCategoryPayload } from "@/core/payload/catalog/update-category-payload";

const baseUrl: string = "/category";

const getAllCategories = async (queryParam: { pageNumber?: number, pageSize?: number, search?: string }): Promise<BaseResponse<Category[]>> => {
    queryParam.search = queryParam.search?.trim() || undefined;
    const response = await api.get(`${baseUrl}`, { params: queryParam });
    return response.data;
};

const getCategoryById = async (id: number): Promise<BaseResponse<Category | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};

const createCategory = async (
    request: AddCategoryPayload
): Promise<BaseResponse<Category>> => {
    const response = await api.post(`${baseUrl}`, request);
    return response.data;
};

const updateCategory = async (
    id: number,
    request: UpdateCategoryPayload
): Promise<BaseResponse<Category>> => {
    const response = await api.put(`${baseUrl}/${id}`, request);
    return response.data;
};

const deleteCategory = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
};

export const categoryRepository = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
