import { UnitGroup } from "@/core/model/infra/unitGroup";

export interface Unit extends BaseModel {
    name?: string;
    status?: string; // UnitStatus enum, assuming string for now
    basePrice?: number;
    maximumCustomer?: number;
    isActive?: boolean;
    unitGroup?: UnitGroup;
    unitGroupId?: number; // for payload
}