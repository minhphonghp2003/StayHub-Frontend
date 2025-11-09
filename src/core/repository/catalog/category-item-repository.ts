import { api } from "@/core/http-client/AxiosClient";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { AddCategoryItemPayload } from "@/core/payload/catalog/add-category-item-payload";
import { UpdateCategoryItemPayload } from "@/core/payload/catalog/update-category-item-payload";

const baseUrl = "/category-item";

const getAllCategoryItems = async (): Promise<BaseResponse<CategoryItem[]>> => {
    const response = await api.get(`${baseUrl}`);
    return response.data;
};

const getCategoryItemById = async (id: number): Promise<BaseResponse<CategoryItem | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};

const getCategoryItemByCategoryCode = async (
    categoryCode: string
): Promise<BaseResponse<CategoryItem[]>> => {
    const response = await api.get(`${baseUrl}/by-category-code/${categoryCode}`);
    return response.data;
};

const getCategoryItemByCategoryId = async (
    categoryId: number
): Promise<BaseResponse<CategoryItem[]>> => {
    const response = await api.get(`${baseUrl}/by-category-id/${categoryId}`);
    return response.data;
};

const createCategoryItem = async (
    request: AddCategoryItemPayload
): Promise<BaseResponse<CategoryItem>> => {
    const response = await api.post(`${baseUrl}`, request);
    return response.data;
};

const updateCategoryItem = async (
    id: number,
    request: UpdateCategoryItemPayload
): Promise<BaseResponse<CategoryItem>> => {
    const response = await api.put(`${baseUrl}/${id}`, request);
    return response.data;
};

const deleteCategoryItem = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
};

export const categoryItemRepository = {
    getAllCategoryItems,
    getCategoryItemById,
    getCategoryItemByCategoryCode,
    getCategoryItemByCategoryId,
    createCategoryItem,
    updateCategoryItem,
    deleteCategoryItem,
};
