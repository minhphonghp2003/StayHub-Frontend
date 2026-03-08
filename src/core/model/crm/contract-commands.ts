import { Contract } from "./contract";
import { RenewContractPayload, TransferContractPayload, RegisterLeavingPayload, ChangeRoomPayload } from "@/core/payload/crm/contract-action-payload";

export type RenewContractCommand = RenewContractPayload;
export type TransferContractCommand = TransferContractPayload;
export type RegisterLeavingCommand = RegisterLeavingPayload;
export type ChangeRoomCommand = ChangeRoomPayload;

export const createRenewContractCommand = (
    contract: Contract,
    newDate: string,
    newPrice?: number,
    newDeposit?: number
): RenewContractCommand => ({
    contractId: contract.id!,
    newDate,
    newPrice,
    newDeposit,
});

export const createTransferContractCommand = (
    contract: Contract,
    newCustomerId: number,
    transferDate: string
): TransferContractCommand => ({
    contractId: contract.id!,
    newCustomerId,
    transferDate,
});

export const createRegisterLeavingCommand = (
    contract: Contract,
    leaveDate: string
): RegisterLeavingCommand => ({
    contractId: contract.id!,
    leaveDate,
});

export const createChangeRoomCommand = (
    contract: Contract,
    unitId: number
): ChangeRoomCommand => ({
    contractId: contract.id!,
    unitId,
});