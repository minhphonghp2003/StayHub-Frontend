export interface RenewContractPayload {
    contractId: number;
    newDate: string;
    newPrice?: number;
    newDeposit?: number;
}

export interface TransferContractPayload {
    contractId: number;
    newCustomerId: number;
    transferDate: string;
}

export interface RegisterLeavingPayload {
    contractId: number;
    leaveDate: string;
}

export interface ChangeRoomPayload {
    contractId: number;
    unitId: number;
}
