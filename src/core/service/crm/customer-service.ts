import { Customer } from "@/core/model/crm/customer";
import { PageInfo } from "@/core/model/BaseResponse";
import { AddCustomerPayload } from "@/core/payload/crm/add-customer-payload";
import { UpdateCustomerPayload } from "@/core/payload/crm/update-customer-payload";
import { customerRepository } from "@/core/repository/crm/customer-repository";

const getCustomerById = async (id: number): Promise<Customer | null> => {
    const result = await customerRepository.getCustomerById(id);
    return result.success ? (result.data ?? null) : null;
};

const getAllCustomers = async (params: {
    propertyId: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<{ data: Customer[]; pageInfo: PageInfo } | null> => {
    const result = await customerRepository.getAllCustomers(params);
    if (result && result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result,
        };
    }
    return null;
};

const getAllCustomersNoPaging = async (propertyId: number): Promise<Customer[] | null> => {
    const result = await customerRepository.getAllCustomersNoPaging(propertyId);
    return result.success ? (result.data ?? []) : null;
};

const createCustomer = async (payload: AddCustomerPayload): Promise<boolean> => {
    const result = await customerRepository.createCustomer(payload);
    return result.data ?? false;
};

const updateCustomer = async (id: number, payload: UpdateCustomerPayload): Promise<Customer | null> => {
    const result = await customerRepository.updateCustomer(id, payload);
    return result.success ? (result.data ?? null) : null;
};

const deleteCustomer = async (id: number): Promise<boolean> => {
    const result = await customerRepository.deleteCustomer(id);
    return result.data ?? false;
};

export const customerService = {
    getCustomerById,
    getAllCustomers,
    getAllCustomersNoPaging,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};
