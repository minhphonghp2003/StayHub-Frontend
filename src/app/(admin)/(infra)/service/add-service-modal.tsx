"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";

import Form from "@/components/form/Form";
import Input from "@/components/form/InputField";
import { FormSelect } from "@/components/form/Select";
import Switch from "@/components/form/Switch";
import TextArea from "@/components/form/TextArea";
import ActionModal from "@/components/ui/modal/ActionModal";
import { AddServicePayload } from "@/core/payload/infra/add-service-payload";
import { serviceService } from "@/core/service/infra/service-service";
import { categoryItemService } from "@/core/service/catalog/category-item-service";
import { Property } from "@/core/model/pmm/property";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { toastPromise } from "@/lib/alert-helper";
import { RootState } from "@/redux/store";


interface AddServiceModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
}

type FormData = {
    name: string;
    unitTypeId: string;
    price: number;
    isActive: boolean;
    description?: string;
};

function AddServiceModal({ isOpen, closeModal, reload }: AddServiceModalProps) {
    const [unitTypes, setUnitTypes] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const form = useForm<FormData>({
        defaultValues: {
            name: "",
            unitTypeId: undefined,
            price: 0,
            isActive: true,
            description: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            fetchDropdowns();
        }
    }, [isOpen]);

    const fetchDropdowns = async () => {
        const units = await categoryItemService.getCategoryItemsByCategoryCode("SERVICE_UNIT_TYPE");
        setUnitTypes(units ?? []);
    };

    const onSubmit = async (data: FormData) => {
        if (!selectedPropertyId) return;
        setLoading(true);
        const payload: AddServicePayload = {
            name: data.name,
            unitTypeId: parseInt(data.unitTypeId),
            price: data.price,
            propertyId: selectedPropertyId,
            isActive: data.isActive,
            description: data.description,
        };
        const result = await toastPromise(
            serviceService.createService(payload),
            {
                loading: "Creating service...",
                success: "Service created successfully!",
                error: "Failed to create service",
            }
        );
        setLoading(false);
        if (result) {
            closeModal();
            reload();
            form.reset();
        }
    };

    return (
        <ActionModal
            isOpen={isOpen}
            closeModal={closeModal}
            heading="Add Service"
            onConfirm={form.handleSubmit(onSubmit)}
            loading={loading}
        >
            <div className="flex flex-col gap-4">

                <div className="flex gap-2">
                    <Input {...form.register("name")} required label="Name" />
                    <FormSelect
                        name="unitTypeId"
                        control={form.control}
                        label="Unit Type"
                        options={unitTypes.map((u) => ({
                            value: (u.id ?? 0).toString(),
                            label: u.name ?? "",
                        }))}
                        placeholder="Select unit type"
                    />
                </div>
                <Input {...form.register("price", { valueAsNumber: true })} type="number" required label="Price" />
                <Controller
                    name="isActive"
                    control={form.control}
                    render={({ field }) => (
                        <Switch
                            label="Active"
                            defaultChecked={field.value}
                            onChange={(checked) => field.onChange(checked)}
                        />
                    )}
                />
                <TextArea
                    name="description"
                    label="Description"
                    placeholder="Enter description (optional)"
                />

            </div>
        </ActionModal>
    );
}

export default AddServiceModal;