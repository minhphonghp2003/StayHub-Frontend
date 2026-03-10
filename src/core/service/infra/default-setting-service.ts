import { DefaultSetting } from "@/core/model/infra/default-setting";
import { SetDefaultSettingPayload } from "@/core/payload/infra/set-default-setting-payload";
import { defaultSettingRepository } from "@/core/repository/infra/default-setting-repository";

const setDefaultSetting = async (payload: SetDefaultSettingPayload): Promise<boolean> => {
    const result = await defaultSettingRepository.setDefaultSetting(payload);
    return result.data ?? false;
};

const getDefaultSetting = async (propertyId: number): Promise<DefaultSetting | null> => {
    const result = await defaultSettingRepository.getDefaultSetting(propertyId);
    return result.success ? (result.data ?? null) : null;
};

export const defaultSettingService = {
    setDefaultSetting,
    getDefaultSetting,
};