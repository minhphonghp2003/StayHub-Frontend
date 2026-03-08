import { Contract } from "./contract";

export class ChangeRoomCommand {
    contractId: number;
    unitId: number;

    constructor(contractId: number, unitId: number) {
        this.contractId = contractId;
        this.unitId = unitId;
    }

    static fromContract(contract: Contract, newUnitId: number): ChangeRoomCommand {
        return new ChangeRoomCommand(contract.id!, newUnitId);
    }
}

export class RenewContractCommand {
    contractId: number;
    newEndDate: string;
    newPrice?: number;
    note?: string;

    constructor(contractId: number, newEndDate: string, newPrice?: number, note?: string) {
        this.contractId = contractId;
        this.newEndDate = newEndDate;
        this.newPrice = newPrice;
        this.note = note;
    }

    static fromContract(contract: Contract, newDate: string, newPrice?: number, note?: string): RenewContractCommand {
        return new RenewContractCommand(contract.id!, newDate, newPrice, note);
    }
}

export class RegisterLeavingCommand {
    contractId: number;
    leavingDate: string;
    reason?: string;
    note?: string;

    constructor(contractId: number, leavingDate: string, reason?: string, note?: string) {
        this.contractId = contractId;
        this.leavingDate = leavingDate;
        this.reason = reason;
        this.note = note;
    }

    static fromContract(contract: Contract, leavingDate: string, reason?: string, note?: string): RegisterLeavingCommand {
        return new RegisterLeavingCommand(contract.id!, leavingDate, reason, note);
    }
}

export class TransferContractCommand {
    contractId: number;
    newCustomerId: number;
    transferDate: string;
    note?: string;

    constructor(contractId: number, newCustomerId: number, transferDate: string, note?: string) {
        this.contractId = contractId;
        this.newCustomerId = newCustomerId;
        this.transferDate = transferDate;
        this.note = note;
    }

    static fromContract(contract: Contract, newCustomerId: number, transferDate: string, note?: string): TransferContractCommand {
        return new TransferContractCommand(contract.id!, newCustomerId, transferDate, note);
    }
}