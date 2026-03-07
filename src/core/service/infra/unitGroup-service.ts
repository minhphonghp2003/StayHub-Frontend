import { UnitGroup } from "@/core/model/infra/unitGroup";
import { PageInfo } from "@/core/model/BaseResponse";
import { AddUnitGroupPayload } from "@/core/payload/infra/add-unitGroup-payload";
import { UpdateUnitGroupPayload } from "@/core/payload/infra/update-unitGroup-payload";
import { unitGroupRepository } from "@/core/repository/infra/unitGroup-repository";

const getAllUnitGroups = async ({
    propertyId,
    pageNumber,
    pageSize,
    search,
}: {
    propertyId: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<{ data: UnitGroup[]; pageInfo: PageInfo } | null> => {
    const result = await unitGroupRepository.getAllUnitGroups({
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

const getAllUnitGroupsNoPaging = async (propertyId: number): Promise<UnitGroup[]> => {
    const result = await unitGroupRepository.getAllUnitGroupsNoPaging(propertyId);
    if (result.success) {
        return result.data ?? [];
    }
    return [];
};

const getUnitGroupById = async (id: number): Promise<UnitGroup | null> => {
    const result = await unitGroupRepository.getUnitGroupById(id);
    return result.success ? result.data ?? null : null;
};

const createUnitGroup = async (
    payload: AddUnitGroupPayload
): Promise<UnitGroup | null> => {
    const result = await unitGroupRepository.createUnitGroup(payload);
    return result.success ? result.data ?? null : null;
};

const updateUnitGroup = async (
    id: number,
    payload: UpdateUnitGroupPayload
): Promise<UnitGroup | null> => {
    const result = await unitGroupRepository.updateUnitGroup(id, payload);
    return result.success ? result.data ?? null : null;
};

const deleteUnitGroup = async (id: number): Promise<boolean> => {
    const result = await unitGroupRepository.deleteUnitGroup(id);
    return result.data ?? false;
};

export const unitGroupService = {
    getAllUnitGroups,
    getAllUnitGroupsNoPaging,
    getUnitGroupById,
    createUnitGroup,
    updateUnitGroup,
    deleteUnitGroup,
};
