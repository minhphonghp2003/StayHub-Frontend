import { Property } from "@/core/model/pmm/property";
import { Unit } from "@/core/model/infra/unit";

export interface Job extends BaseModel {
    name?: string;
    propertyId?: number;
    unitId?: number;
    description?: string;
    isActive?: boolean;
    property?: Property;
    unit?: Unit;
}
