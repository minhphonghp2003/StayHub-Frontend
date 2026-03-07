import { Property } from "@/core/model/pmm/property";
import { AddPropertyPayload } from "@/core/payload/pmm/add-property-payload";
import { UpdatePropertyPayload } from "@/core/payload/pmm/update-property-payload";
import { propertyRepository } from "@/core/repository/pmm/property-repository";
import { PageInfo } from "@/core/model/BaseResponse";

const getAllProperties = async ({ pageNumber, pageSize, search }: any): Promise<{ data: Property[]; pageInfo: PageInfo } | null> => {
    const result = await propertyRepository.getAllProperties({ pageNumber, pageSize, search });
    if (result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result ?? null,
        };
    }
    return null;
};

const getPropertyById = async (id: number): Promise<Property | null> => {
    const result = await propertyRepository.getPropertyById(id);
    return result.success ? (result.data ?? null) : null;
};

const createProperty = async (payload: AddPropertyPayload): Promise<Property | null> => {
    const result = await propertyRepository.createProperty(payload);
    return result.success ? (result.data ?? null) : null;
};

const updateProperty = async (id: number, payload: UpdatePropertyPayload): Promise<Property | null> => {
    const result = await propertyRepository.updateProperty(id, payload);
    return result.success ? (result.data ?? null) : null;
};

const deleteProperty = async (id: number): Promise<boolean> => {
    const result = await propertyRepository.deleteProperty(id);
    return result.data ?? false;
};

const getMyProperties = async (): Promise<Property[] | null> => {
    const result = await propertyRepository.getMyProperties();
    return result.success ? (result.data ?? []) : null;
};

export const propertyService = {
    getAllProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getMyProperties,
};
