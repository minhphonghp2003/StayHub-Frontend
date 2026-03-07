import { Vehicle } from "@/core/model/crm/vehicle";
import { PageInfo } from "@/core/model/BaseResponse";
import { AddVehiclePayload } from "@/core/payload/crm/add-vehicle-payload";
import { UpdateVehiclePayload } from "@/core/payload/crm/update-vehicle-payload";
import { vehicleRepository } from "@/core/repository/crm/vehicle-repository";

const getVehicleById = async (id: number): Promise<Vehicle | null> => {
    const result = await vehicleRepository.getVehicleById(id);
    return result.success ? (result.data ?? null) : null;
};

const getAllVehicles = async (params: {
    propertyId: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<{ data: Vehicle[]; pageInfo: PageInfo } | null> => {
    const result = await vehicleRepository.getAllVehicles(params);
    if (result && result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result,
        };
    }
    return null;
};

const getAllVehiclesNoPaging = async (customerId: number): Promise<Vehicle[] | null> => {
    const result = await vehicleRepository.getAllVehiclesNoPaging(customerId);
    return result.success ? (result.data ?? []) : null;
};

const createVehicle = async (payload: AddVehiclePayload): Promise<boolean> => {
    const result = await vehicleRepository.createVehicle(payload);
    return result.data ?? false;
};

const updateVehicle = async (id: number, payload: UpdateVehiclePayload): Promise<Vehicle | null> => {
    const result = await vehicleRepository.updateVehicle(id, payload);
    return result.success ? (result.data ?? null) : null;
};

const deleteVehicle = async (id: number): Promise<boolean> => {
    const result = await vehicleRepository.deleteVehicle(id);
    return result.data ?? false;
};

export const vehicleService = {
    getVehicleById,
    getAllVehicles,
    getAllVehiclesNoPaging,
    createVehicle,
    updateVehicle,
    deleteVehicle,
};
