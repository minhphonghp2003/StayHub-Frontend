import { Unit } from "@/core/model/infra/unit";
import { Customer } from "./customer";
import { Asset } from "@/core/model/infra/asset";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { User } from "@/core/model/RBAC/User";
import { Service } from "@/core/model/infra/service";

export interface ContractAsset extends BaseModel {
    assetId: number;
    asset?: Asset;
    quantity: number;
}

export interface Contract extends BaseModel {
    unitId: number;
    unit?: Unit;
    vehicleNumber: number;
    customer?: Customer[];
    assets?: ContractAsset[];
    services?: Service[];
    status: string;
    price: number;
    deposit: number;
    depositRemain?: number;
    depositRemainEndDate?: string;
    startDate: string;
    endDate: string;
    paymentPeriodId: number;
    paymentPeriod?: CategoryItem;
    note?: string;
    attachment?: string;
    code: string;
    isSigned: boolean;
    templateId?: number;
    saleId?: number;
    sale?: User;
}
