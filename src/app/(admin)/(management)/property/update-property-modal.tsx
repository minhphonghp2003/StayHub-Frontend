"use client";
import Input from "@/components/form/InputField";
import { FormSelect } from "@/components/form/Select";
import ActionModal from "@/components/ui/modal/ActionModal";
import { Property } from "@/core/model/pmm/property";
import { UpdatePropertyPayload } from "@/core/payload/pmm/update-property-payload";
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
                    loading: "Cập nhật property...",
                    success: "Cập nhật property thành công!",
                    error: "Cập nhật property thất bại!",
                }
            );

            if (result) {
                closeModal();
                reload();
                form.reset();
            }
        } catch (err) {
            showToast({ type: "error", content: "Có lỗi xảy ra" });
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);

        propertyService.getPropertyById(property?.id ?? 0).then((propertyDetail) => {
            form.reset({
                name: propertyDetail?.name ?? "",
                address: propertyDetail?.address ?? "",
                typeId: propertyDetail?.type?.id ?? (propertyTypes[0]?.id || 0),
                image: propertyDetail?.image ?? "",
                wardId: propertyDetail?.wardId,
                provinceId: propertyDetail?.provinceId,
            });
            setIsLoading(false);
        });

        return () => {
            form.reset({
                name: "",
                address: "",
                typeId: propertyTypes[0]?.id || 0,
                image: "",
            });
        };
    }, [isOpen]);

    return (
        <ActionModal
            size="lg"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleSubmitForm)}
            heading="Cập nhật property"
        >
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input {...form.register("name")} label="Tên" />
                    <Input {...form.register("address")} label="Địa chỉ" />
                </div>

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

                <Input
                    {...form.register("image")}
                    label="Hình ảnh (URL)"
                    placeholder="https://..."
                />

                <div className="flex gap-2">
                    <Input {...form.register("wardId", { valueAsNumber: true })} label="Ward ID" type="number" />
                    <Input {...form.register("provinceId", { valueAsNumber: true })} label="Province ID" type="number" />
                </div>
            </div>
        </ActionModal>
    );
}

export default UpdatePropertyModal;
