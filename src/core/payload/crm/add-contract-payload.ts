export interface ContractAssetPayload {
    assetId: number;
    quantity: number;
}

export interface AddContractPayload {
    customerIds: number[];
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
    isSigned: boolean;
    templateId?: number;
    services?: number[];
    assets?: ContractAssetPayload[];
    representativeId: number;
    vehicleNumber: number;
    saleId?: number;
}
