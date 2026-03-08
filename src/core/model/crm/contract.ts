import { Unit } from "@/core/model/infra/unit";
import { Customer } from "./customer";
import { Service } from "@/core/model/infra/service";
import { Asset } from "@/core/model/infra/asset";
import { CategoryItem } from "@/core/model/catalog/category-item";

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
    customers?: Customer[];
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
    services?: ContractService[];
    assets?: ContractAsset[];
    representativeId?: number;
    vehicleNumber?: number;
    saleId?: number;
}
