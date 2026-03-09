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
    services?: number[];
    assets?: ContractAssetPayload[];
    customerIds: number[];
    representativeId: number;
}
