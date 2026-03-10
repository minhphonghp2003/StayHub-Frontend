import { Contract } from "@/core/model/crm/contract";
import { PageInfo } from "@/core/model/BaseResponse";
import { AddContractPayload } from "@/core/payload/crm/add-contract-payload";
import { UpdateContractPayload } from "@/core/payload/crm/update-contract-payload";
import { RenewContractPayload, TransferContractPayload, RegisterLeavingPayload } from "@/core/payload/crm/contract-action-payload";
import { contractRepository } from "@/core/repository/crm/contract-repository";

const statusToInt: Record<string, number> = {
    Pending: 0,
    Active: 1,
    ExpiringSoon: 2,
    Expired: 3,
    Terminated: 4,
    Canceled: 5,
};

const getContractById = async (id: number): Promise<Contract | null> => {
    const result = await contractRepository.getContractById(id);
    return result.success ? (result.data ?? null) : null;
};

const getAllContracts = async (params: {
    propertyId: number;
    status?: string;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<{ data: Contract[]; pageInfo: PageInfo } | null> => {
    const result = await contractRepository.getAllContracts({
        ...params,
        status: params.status ? statusToInt[params.status] : undefined,
    });
    if (result && result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result,
        };
    }
    return null;
};

const createContract = async (payload: AddContractPayload): Promise<boolean> => {
    const result = await contractRepository.createContract(payload);
    return result.data ?? false;
};

const updateContract = async (id: number, payload: UpdateContractPayload): Promise<Contract | null> => {
    const result = await contractRepository.updateContract(id, payload);
    return result.success ? (result.data ?? null) : null;
};

const deleteContract = async (id: number): Promise<boolean> => {
    const result = await contractRepository.deleteContract(id);
    return result.data ?? false;
};

const changeRoom = async (contractId: number, unitId: number): Promise<boolean> => {
    const result = await contractRepository.changeRoom(contractId, unitId);
    return result.data ?? false;
};

const renewContract = async (payload: RenewContractPayload): Promise<boolean> => {
    const result = await contractRepository.renewContract(payload);
    return result.data ?? false;
};

const registerLeaving = async (payload: RegisterLeavingPayload): Promise<boolean> => {
    const result = await contractRepository.registerLeaving(payload);
    return result.data ?? false;
};

const transferContract = async (payload: TransferContractPayload): Promise<boolean> => {
    const result = await contractRepository.transferContract(payload);
    return result.data ?? false;
};

export const contractService = {
    getContractById,
    getAllContracts,
    createContract,
    updateContract,
    deleteContract,
    changeRoom,
    renewContract,
    registerLeaving,
    transferContract,
};
