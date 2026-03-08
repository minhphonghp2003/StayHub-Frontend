import { Unit } from "@/core/model/infra/unit";
import { Customer } from "./customer";
import { Service } from "@/core/model/infra/service";
import { Asset } from "@/core/model/infra/asset";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { User } from "@/core/model/RBAC/User";

export interface ContractService extends BaseModel {
    serviceId: number;
    service?: Service;
    quantity: number;
}

export interface ContractAsset extends BaseModel {
    assetId: number;
    asset?: Asset;
    quantity: number;
}

export interface Contract extends BaseModel {
    unitId: number;
    unit?: Unit;
    customer?: Customer[];
    assets?: ContractAsset[];
    services?: ContractService[];
    status?: string;
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
    vehicleNumber?: number;
}
