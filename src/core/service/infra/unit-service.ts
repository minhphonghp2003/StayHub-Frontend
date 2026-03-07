import { Unit } from "@/core/model/infra/unit";
import { PageInfo } from "@/core/model/BaseResponse";
import { AddUnitPayload } from "@/core/payload/infra/add-unit-payload";
import { UpdateUnitPayload } from "@/core/payload/infra/update-unit-payload";
import { unitRepository } from "@/core/repository/infra/unit-repository";

const getAllUnits = async ({
    propertyId,
    pageNumber,
    pageSize,
    search,
}: {
    propertyId: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<{ data: Unit[]; pageInfo: PageInfo } | null> => {
    const result = await unitRepository.getAllUnits({
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

const getUnitById = async (id: number): Promise<Unit | null> => {
    const result = await unitRepository.getUnitById(id);
    return result.success ? result.data ?? null : null;
};

const createUnit = async (
    payload: AddUnitPayload
): Promise<Unit | null> => {
    const result = await unitRepository.createUnit(payload);
    return result.success ? result.data ?? null : null;
};

const updateUnit = async (
    id: number,
    payload: UpdateUnitPayload
): Promise<Unit | null> => {
    const result = await unitRepository.updateUnit(id, payload);
    return result.success ? result.data ?? null : null;
};

const deleteUnit = async (id: number): Promise<boolean> => {
    const result = await unitRepository.deleteUnit(id);
    return result.data ?? false;
};

const setActivation = async (unitId: number, isActivate: boolean): Promise<boolean> => {
    const result = await unitRepository.setActivation(unitId, isActivate);
    return result.data ?? false;
};

const getAllUnitsNoPaging = async (propertyId: number): Promise<Unit[]> => {
    const result = await unitRepository.getAllUnitsNoPaging(propertyId);
    return result.success ? result.data ?? [] : [];
};

export const unitService = {
    getAllUnits,
    getUnitById,
    getAllUnitsNoPaging,
    createUnit,
    updateUnit,
    deleteUnit,
    setActivation,
};