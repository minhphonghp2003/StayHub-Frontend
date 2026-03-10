import { CategoryItem } from "@/core/model/catalog/category-item";
import { Province, Ward } from "@/core/model/address/address";
import { Unit } from "@/core/model/infra/unit";

export interface Customer extends BaseModel {
    name: string;
    phone: string;
    email?: string;
    cccd?: string;
    genderId?: number;
    gender?: CategoryItem;
    provinceId?: number;
    province?: Province;
    wardId?: number;
    ward?: Ward;
    unitId?: number;
    unit?: Unit;
    isRepresentative: boolean;
    dateOfBirth?: string; // ISO string
    address?: string;
    image?: string;
    job?: string;
    isWalkin?: boolean;
}
