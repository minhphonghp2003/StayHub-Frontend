export interface ContractServicePayload {
    serviceId: number;
    quantity: number;
}

export interface ContractAssetPayload {
    assetId: number;
    quantity: number;
}

export interface UpdateContractPayload {
    unitId: number;
    price: number;
    deposit: number;
    depositRemain?: number;
    depositRemainEndDate?: string;
    startDate: string;
    endDate: string;
    paymentPeriodId: number;
    note?: string;
    attachment?: string;
    code: string;
    isSigned: boolean;
    templateId?: number;
    services?: ContractServicePayload[];
    assets?: ContractAssetPayload[];
    customerIds: number[];
    representativeId: number;
    saleId?: number;
    vehicleNumber?: number;
}
