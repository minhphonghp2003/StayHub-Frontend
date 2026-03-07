import { Service } from "@/core/model/infra/service";
import { PageInfo } from "@/core/model/BaseResponse";
import { AddServicePayload } from "@/core/payload/infra/add-service-payload";
import { UpdateServicePayload } from "@/core/payload/infra/update-service-payload";
import { serviceRepository } from "@/core/repository/infra/service-repository";

const getAllServices = async ({
    propertyId,
    pageNumber,
    pageSize,
    search,
}: {
    propertyId: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<{ data: Service[]; pageInfo: PageInfo } | null> => {
    const result = await serviceRepository.getAllServices({
        propertyId,
        pageNumber,
        pageSize,
        search,
    });
    if (result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result ?? null,
        };
    }
    return null;
};

const getServiceById = async (id: number): Promise<Service | null> => {
    const result = await serviceRepository.getServiceById(id);
    return result.success ? result.data ?? null : null;
};

const createService = async (
    payload: AddServicePayload
): Promise<Service | null> => {
    const result = await serviceRepository.createService(payload);
    return result.success ? result.data ?? null : null;
};

const updateService = async (
    id: number,
    payload: UpdateServicePayload
): Promise<Service | null> => {
    const result = await serviceRepository.updateService(id, payload);
    return result.success ? result.data ?? null : null;
};

const deleteService = async (id: number): Promise<boolean> => {
    const result = await serviceRepository.deleteService(id);
    return result.data ?? false;
};

const setActivateService = async (id: number, isActivate: boolean): Promise<boolean> => {
    const result = await serviceRepository.setActivateService(id, isActivate);
    return result.data ?? false;
};

export const serviceService = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    setActivateService,
};