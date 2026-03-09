import { Property } from "@/core/model/pmm/property";
import { CategoryItem } from "@/core/model/catalog/category-item";

export interface Service extends BaseModel {
    name: string;
    propertyId: number;
    unitTypeId: number;
    unitType?: CategoryItem;
    isActive: boolean;
    description?: string;
    price: number;
}