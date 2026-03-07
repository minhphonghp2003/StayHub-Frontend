import { CategoryItem } from "@/core/model/catalog/category-item";

export interface Asset extends BaseModel {
    name?: string;
    quantity?: number;
    price?: number;
    typeId?: number;
    propertyId?: number;
    unitId?: number;
    note?: string;
    image?: string;
    type?: CategoryItem;
}
