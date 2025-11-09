import { Category } from "@/core/model/catalog/category";
import { AddCategoryPayload } from "@/core/payload/catalog/add-category-payload";
import { UpdateCategoryPayload } from "@/core/payload/catalog/update-category-payload";
import { categoryRepository } from "@/core/repository/catalog/category-repository";

const getAllCategories = async (): Promise<Category[]> => {
    const result = await categoryRepository.getAllCategories();
    if (result.success) {
        return result.data ?? [];
    }
    return [];
};

const getCategoryById = async (id: number): Promise<Category | null> => {
    const result = await categoryRepository.getCategoryById(id);
    return result.success ? result.data ?? null : null;
};

const createCategory = async (payload: AddCategoryPayload): Promise<Category | null> => {
    const result = await categoryRepository.createCategory(payload);
    return result.success ? result.data ?? null : null;
};

const updateCategory = async (
    id: number,
    payload: UpdateCategoryPayload
): Promise<Category | null> => {
    const result = await categoryRepository.updateCategory(id, payload);
    return result.success ? result.data ?? null : null;
};

const deleteCategory = async (id: number): Promise<boolean> => {
    const result = await categoryRepository.deleteCategory(id);
    return result.data ?? false;
};

export const categoryService = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
