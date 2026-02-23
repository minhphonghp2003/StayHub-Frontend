"use client";
import Input from "@/components/form/InputField";
import { FormSelect } from "@/components/form/Select";
import ActionModal from "@/components/ui/modal/ActionModal";
import { Province, Ward } from "@/core/model/address/address";
import { AddPropertyPayload } from "@/core/payload/pmm/add-property-payload";
import { addressService } from "@/core/service/address/address-service";
import { propertyService } from "@/core/service/pmm/property-service";
import { showToast, toastPromise } from "@/lib/alert-helper";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
    name: string;
    address?: string;
    typeId: number;
    image?: string;
    tierId: number;
    subscriptionStatusId?: number;
    startSubscriptionDate?: string;
    endSubscriptionDate?: string;
    lastPaymentDate?: string;
    wardId?: number;
    provinceId?: number;
};

function AddPropertyModal({
    isOpen,
    closeModal,
    reload,
    tiers = [],
    propertyTypes = [],
    subscriptionStatuses = [],
}: {
    isOpen: boolean;
    closeModal: any;
    reload?: any;
    tiers?: any[];
    propertyTypes?: any[];
    subscriptionStatuses?: any[];
}) {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [loadingAddressData, setLoadingAddressData] = useState(false);

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            address: "",
            typeId: undefined,
            tierId: undefined,
            subscriptionStatusId: undefined,
            startSubscriptionDate: undefined,
            endSubscriptionDate: undefined,
            lastPaymentDate: undefined,
            wardId: undefined,
            provinceId: undefined,
            image: "",
        },
    });

    const handleAddProperty: SubmitHandler<FormValues> = async (data) => {
        const payload: AddPropertyPayload = {
            name: data.name,
            address: data.address,
            typeId: data.typeId,
            image: data.image,
            tierId: data.tierId,
            subscriptionStatusId: data.subscriptionStatusId,
            startSubscriptionDate: data.startSubscriptionDate
                ? new Date(data.startSubscriptionDate)
                : undefined,
            endSubscriptionDate: data.endSubscriptionDate
                ? new Date(data.endSubscriptionDate)
                : undefined,
            lastPaymentDate: data.lastPaymentDate
                ? new Date(data.lastPaymentDate)
                : undefined,
            wardId: data.wardId,
            provinceId: data.provinceId,
        };

        try {
            const result = await toastPromise(propertyService.createProperty(payload), {
                loading: "Đang tạo nhà...",
                success: "Tạo nhà thành công!",
                error: "Tạo nhà thất bại!",
            });

            if (result) {
                closeModal();
                reload?.();
                form.reset();
            }
        } catch {
            showToast({ type: "error", content: "Có lỗi xảy ra" });
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const loadAddressData = async () => {
            setLoadingAddressData(true);
            try {
                const [provinceData, wardData] = await Promise.all([
                    addressService.getAllProvinces(),
                    addressService.getAllWards(),
                ]);
                if (provinceData) setProvinces(provinceData);
                if (wardData) setWards(wardData);
            } catch (error) {
                console.error("Failed to load address data:", error);
                showToast({ type: "error", content: "Không thể tải dữ liệu địa chỉ" });
            } finally {
                setLoadingAddressData(false);
            }
        };

        loadAddressData();

        return () => {
            form.reset({
                name: "",
                address: "",
                typeId: undefined,
                tierId: undefined,
                subscriptionStatusId: undefined,
                startSubscriptionDate: undefined,
                endSubscriptionDate: undefined,
                lastPaymentDate: undefined,
                wardId: undefined,
                provinceId: undefined,
                image: "",
            });
        };
    }, [isOpen]);

    return (
        <ActionModal
            size="lg"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleAddProperty)}
            heading="Thêm mới nhà"
        >
            <div className="flex flex-col gap-4  overflow-y-auto">
                <Input {...form.register("name")} required label="Tên" />

                <div className="flex gap-2">
                    <FormSelect
                        name="typeId"
                        control={form.control}
                        label="Loại"
                        required
                        options={propertyTypes.map((type) => ({
                            value: type.id?.toString(),
                            label: type.name,
                        }))}
                    />
                    <FormSelect
                        name="tierId"
                        control={form.control}
                        label="Gói dịch vụ"
                        required
                        options={tiers.map((tier) => ({
                            value: tier.id?.toString(),
                            label: tier.name,
                        }))}
                    />
                </div>

                <div className="flex gap-2">
                    <FormSelect
                        name="subscriptionStatusId"
                        control={form.control}
                        label="Trạng thái đăng ký"
                        options={subscriptionStatuses.map((status) => ({
                            value: status.id?.toString(),
                            label: status.name,
                        }))}
                    />
                </div>

                <div className="flex gap-2">
                    <Input
                        {...form.register("startSubscriptionDate")}
                        label="Ngày bắt đầu"
                        type="date"
                    />
                    <Input
                        {...form.register("endSubscriptionDate")}
                        label="Ngày kết thúc"
                        type="date"
                    />
                </div>

                <div className="flex gap-2">
                    <FormSelect
                        name="provinceId"
                        control={form.control}
                        label="Tỉnh/Thành phố"
                        disabled={loadingAddressData}
                        options={provinces.map((province) => ({
                            value: province.id?.toString(),
                            label: province.name || "",
                        }))}
                    />
                    <FormSelect
                        name="wardId"
                        control={form.control}
                        label="Phường/Xã"
                        disabled={loadingAddressData}
                        options={wards.map((ward) => ({
                            value: ward.id?.toString(),
                            label: ward.name || "",
                        }))}
                    />
                </div>

                <Input {...form.register("address")} label="Địa chỉ" />
                <Input
                    {...form.register("image")}
                    label="Hình ảnh (URL)"
                    placeholder="https://..."
                />
            </div>
        </ActionModal>
    );
}

export default AddPropertyModal;
