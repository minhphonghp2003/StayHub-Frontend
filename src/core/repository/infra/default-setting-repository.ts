import { api } from "@/core/http-client/AxiosClient";
import { BaseResponse } from "@/core/model/BaseResponse";
import { DefaultSetting } from "@/core/model/infra/default-setting";
import { SetDefaultSettingPayload } from "@/core/payload/infra/set-default-setting-payload";
import { GetDefaultSettingPayload } from "@/core/payload/infra/get-default-setting-payload";

const baseUrl = "/property";

const setDefaultSetting = async (payload: SetDefaultSettingPayload): Promise<BaseResponse<boolean>> => {
    const response = await api.request({
        url: `${baseUrl}/default-setting`,
        method: "POST",
        data: {
            "basePrice": payload.defaultBasePrice,
            "propertyId": payload.propertyId,
            "paymentDate": payload.defaultPaymentDate,
        },
    });
    return response.data;
};

const getDefaultSetting = async (propertyId: number): Promise<BaseResponse<DefaultSetting>> => {
    const response = await api.request({
        url: `${baseUrl}/default-setting/${propertyId}`,
        method: "GET",
    });
    return response.data;
};

export const defaultSettingRepository = {
    setDefaultSetting,
    getDefaultSetting,
};