import { Property } from "@/core/model/pmm/property";
import { CategoryItem } from "@/core/model/catalog/category-item";

export interface Service extends BaseModel {
    name?: string;
    unitTypeId?: number;
    price?: number;
    propertyId?: number;
    isActive?: boolean;
    description?: string;
    unitType?: CategoryItem;
    property?: Property;
}