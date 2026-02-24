"use client";
import Loading from "@/components/common/Loading";
import Input from "@/components/form/InputField";
import { FormSelect } from "@/components/form/Select";
import ActionModal from "@/components/ui/modal/ActionModal";
import { Province, Ward } from "@/core/model/address/address";
import { Property } from "@/core/model/pmm/property";
import { UpdatePropertyPayload } from "@/core/payload/pmm/update-property-payload";
import { addressService } from "@/core/service/address/address-service";
import { propertyService } from "@/core/service/pmm/property-service";
import { showToast, toastPromise } from "@/lib/alert-helper";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
    name?: string;
    address?: string;
    typeId: number;
    image?: string;
    wardId?: number;
    provinceId?: number;
};

function UpdatePropertyModal({
    isOpen,
    closeModal,
    property,
    reload,
    propertyTypes = [],
}: {
    isOpen: boolean;
    closeModal: any;
    property?: Property | null;
    reload: any;
    propertyTypes?: any[];
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [loadingAddressData, setLoadingAddressData] = useState(false);
    const form = useForm<FormValues>();

    const handleSubmitForm: SubmitHandler<FormValues> = async (data) => {
        const payload: UpdatePropertyPayload = {
            name: data.name,
            address: data.address,
            typeId: data.typeId,
            image: data.image,
            wardId: data.wardId,
            provinceId: data.provinceId,
        };

        try {
            const result = await toastPromise(
                propertyService.updateProperty(property?.id ?? 0, payload),
                {
                    loading: "Cập nhật nhà...",
                    success: "Cập nhật nhà thành công!",
                    error: "Cập nhật nhà thất bại!",
                }
            );

            if (result) {
                closeModal();
                reload();
                form.reset();
            }
        } catch (err) {
            // error already displayed by toastPromise
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);
        setLoadingAddressData(true);

        const loadData = async () => {
            try {
                const [propertyDetail, provinceData] = await Promise.all([
                    propertyService.getPropertyById(property?.id ?? 0),
                    addressService.getAllProvinces(),
                ]);

                if (provinceData) setProvinces(provinceData);

                if (propertyDetail) {
                    // Load wards for the property's province if it exists
                    let wardData = null;
                    if (propertyDetail.provinceId) {
                        wardData = await addressService.getAllWardsByProvince(propertyDetail.provinceId);
                    }

                    // Set both provinces and wards before resetting form
                    if (wardData) setWards(wardData);

                    // Reset form with proper values
                    setTimeout(() => {
                        form.reset({
                            name: propertyDetail.name ?? "",
                            address: propertyDetail.address ?? "",
                            typeId: propertyDetail.type?.id ?? (propertyTypes[0]?.id || 0),
                            image: propertyDetail.image ?? "",
                            wardId: propertyDetail.wardId,
                            provinceId: propertyDetail.provinceId,
                        });
                    }, 0);
                }

            } catch (error) {
                console.error("Failed to load data:", error);
                showToast({ type: "error", content: "Không thể tải dữ liệu" });
            } finally {
                setIsLoading(false);
                setLoadingAddressData(false);
            }
        };

        loadData();

        return () => {
            form.reset({
                name: "",
                address: "",
                typeId: propertyTypes[0]?.id || 0,
                image: "",
                wardId: undefined,
                provinceId: undefined,
            });
        };
    }, [isOpen]);

    const handleProvinceChange = async (value: string) => {
        const numValue = Number(value);
        form.setValue("wardId", undefined);

        if (!value) {
            setWards([]);
            return;
        }

        setLoadingAddressData(true);
        try {
            const wardData = await addressService.getAllWardsByProvince(numValue);
            if (wardData) setWards(wardData);
        } catch (error) {
            console.error("Failed to load wards:", error);
            showToast({ type: "error", content: "Không thể tải dữ liệu phường/xã" });
        } finally {
            setLoadingAddressData(false);
        }
    };

    return (
        <ActionModal
            size="lg"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleSubmitForm)}
            heading="Cập nhật nhà"
        >
            {isLoading && <Loading />}
            <div className="flex flex-col gap-4">
                <Input {...form.register("name")} label="Tên" />

                <FormSelect
                    name="typeId"
                    control={form.control}
                    label="Loại hình cho thuê"
                    required
                    options={propertyTypes.map((type) => ({
                        value: type.id?.toString(),
                        label: type.name,
                    }))}
                />


                <div className="flex gap-2">
                    <FormSelect
                        name="provinceId"
                        control={form.control}
                        label="Tỉnh/Thành phố"
                        disabled={loadingAddressData}
                        onChange={(value) => handleProvinceChange(value as string)}
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

export default UpdatePropertyModal;
