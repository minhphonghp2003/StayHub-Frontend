import { CategoryItem } from "@/core/model/catalog/category-item";
import { AddCategoryItemPayload } from "@/core/payload/catalog/add-category-item-payload";
import { UpdateCategoryItemPayload } from "@/core/payload/catalog/update-category-item-payload";
import { categoryItemRepository } from "@/core/repository/catalog/category-item-repository";

const getAllCategoryItems = async (): Promise<CategoryItem[]> => {
    const result = await categoryItemRepository.getAllCategoryItems();
    return result.success ? result.data ?? [] : [];
};

const getCategoryItemById = async (id: number): Promise<CategoryItem | null> => {
    const result = await categoryItemRepository.getCategoryItemById(id);
    return result.success ? result.data ?? null : null;
};

const getCategoryItemsByCategoryCode = async (categoryCode: string): Promise<CategoryItem[]> => {
    const result = await categoryItemRepository.getCategoryItemByCategoryCode(categoryCode);
    return result.success ? result.data ?? [] : [];
};

const getCategoryItemsByCategoryId = async (categoryId: number): Promise<CategoryItem[]> => {
    const result = await categoryItemRepository.getCategoryItemByCategoryId(categoryId);
    return result.success ? result.data ?? [] : [];
};

const createCategoryItem = async (payload: AddCategoryItemPayload): Promise<CategoryItem | null> => {
    const result = await categoryItemRepository.createCategoryItem(payload);
    return result.success ? result.data ?? null : null;
};

const updateCategoryItem = async (
    id: number,
    payload: UpdateCategoryItemPayload
): Promise<CategoryItem | null> => {
    const result = await categoryItemRepository.updateCategoryItem(id, payload);
    return result.success ? result.data ?? null : null;
};

const deleteCategoryItem = async (id: number): Promise<boolean> => {
    const result = await categoryItemRepository.deleteCategoryItem(id);
    return result.data ?? false;
};

export const categoryItemService = {
    getAllCategoryItems,
    getCategoryItemById,
    getCategoryItemsByCategoryCode,
    getCategoryItemsByCategoryId,
    createCategoryItem,
    updateCategoryItem,
    deleteCategoryItem,
};
