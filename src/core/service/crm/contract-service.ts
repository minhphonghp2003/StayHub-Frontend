import { Contract } from "@/core/model/crm/contract";
import { PageInfo } from "@/core/model/BaseResponse";
import { AddContractPayload } from "@/core/payload/crm/add-contract-payload";
import { UpdateContractPayload } from "@/core/payload/crm/update-contract-payload";
import { contractRepository } from "@/core/repository/crm/contract-repository";

const getContractById = async (id: number): Promise<Contract | null> => {
    const result = await contractRepository.getContractById(id);
    return result.success ? (result.data ?? null) : null;
};

const getAllContracts = async (params: {
    propertyId: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<{ data: Contract[]; pageInfo: PageInfo } | null> => {
    const result = await contractRepository.getAllContracts(params);
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

export const contractService = {
    getContractById,
    getAllContracts,
    createContract,
    updateContract,
    deleteContract,
};
