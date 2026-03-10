"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/shadcn/button";
import InputField from "@/components/form/InputField";
import Label from "@/components/form/Label";
import { toastPromise } from "@/lib/alert-helper";
import { RootState } from "@/redux/store";
import { defaultSettingService } from "@/core/service/infra/default-setting-service";
import { DefaultSetting } from "@/core/model/infra/default-setting";
import { SetDefaultSettingPayload } from "@/core/payload/infra/set-default-setting-payload";

interface SettingFormValues {
    defaultBasePrice: string;
    defaultPaymentDate: string;
}

function SettingPage() {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    const form = useForm<SettingFormValues>({
        defaultValues: {
            defaultBasePrice: "",
            defaultPaymentDate: "",
        },
        mode: "onChange",
    });

    const fetchSettings = async () => {
        if (!selectedPropertyId) return;
        setInitialLoading(true);
        const settings = await defaultSettingService.getDefaultSetting(selectedPropertyId);
        if (settings) {
            form.setValue("defaultBasePrice", settings.defaultBasePrice?.toString() || "");
            form.setValue("defaultPaymentDate", settings.defaultPaymentDate || "");
        }
        setInitialLoading(false);
    };

    useEffect(() => {
        fetchSettings();
    }, [selectedPropertyId]);

    const onSubmit = async (data: SettingFormValues) => {
        if (!selectedPropertyId) return;

        const payload: SetDefaultSettingPayload = {
            propertyId: selectedPropertyId,
            defaultBasePrice: data.defaultBasePrice ? parseInt(data.defaultBasePrice) : undefined,
            defaultPaymentDate: data.defaultPaymentDate || undefined,
        };

        setLoading(true);
        const result = await toastPromise(defaultSettingService.setDefaultSetting(payload), {
            loading: "Đang lưu cài đặt...",
            success: "Cài đặt đã được lưu thành công!",
            error: "Lỗi khi lưu cài đặt",
        });
        setLoading(false);

        if (result) {
            // Optionally refetch or just keep
        }
    };

    if (initialLoading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Cài đặt mặc định</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <div>
                    <Label htmlFor="defaultBasePrice">Giá mặc định (VNĐ)</Label>
                    <InputField
                        id="defaultBasePrice"
                        type="number"
                        placeholder="Nhập giá mặc định"
                        {...form.register("defaultBasePrice")}
                    />
                </div>
                <div>
                    <Label htmlFor="defaultPaymentDate">Ngày thanh toán mặc định</Label>
                    <InputField
                        id="defaultPaymentDate"
                        type="date"
                        {...form.register("defaultPaymentDate")}
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
            </form>
        </div>
    );
}

export default SettingPage;