"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";

import Form from "@/components/form/Form";
import Input from "@/components/form/InputField";
import PriceInput from "@/components/form/PriceInput";
import { FormSelect } from "@/components/form/Select";
import TextArea from "@/components/form/TextArea";
import ActionModal from "@/components/ui/modal/ActionModal";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { UpdateServicePayload } from "@/core/payload/infra/update-service-payload";
import { serviceService } from "@/core/service/infra/service-service";
import { categoryItemService } from "@/core/service/catalog/category-item-service";
import { Service } from "@/core/model/infra/service";
import { Property } from "@/core/model/pmm/property";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { toastPromise } from "@/lib/alert-helper";
import { RootState } from "@/redux/store";

type FormData = {
    name: string;
    unitTypeId: string;
    price: number;
    description?: string;
};

interface UpdateServiceModalProps {
    isOpen: boolean;
    closeModal: () => void;
    serviceId: number | null;
    reload: () => void;
}

function UpdateServiceModal({ isOpen, closeModal, serviceId, reload }: UpdateServiceModalProps) {
    const [service, setService] = useState<Service | null>(null);
    const [unitTypes, setUnitTypes] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const form = useForm<FormData>({
        defaultValues: {
            name: "",
            unitTypeId: undefined,
            price: 0,
            description: "",
        },
    });

    useEffect(() => {
        if (isOpen && serviceId) {
            setIsLoading(true);
            Promise.all([
                serviceService.getServiceById(serviceId!),
                fetchDropdowns(),
            ]).then(([serviceDetail]) => {
                setService(serviceDetail);
                if (serviceDetail) {
                    form.reset({
                        name: serviceDetail.name ?? "",
                        unitTypeId: (serviceDetail.unitTypeId ?? 0).toString(),
                        price: serviceDetail.price ?? 0,
                        description: serviceDetail.description ?? "",
                    });
                }
                setIsLoading(false);
            });
        }
    }, [isOpen, serviceId]);

    const fetchDropdowns = async () => {
        const units = await categoryItemService.getCategoryItemsByCategoryCode("SERVICE_UNIT_TYPE");
        setUnitTypes(units ?? []);
    };

    const onSubmit = async (data: FormData) => {
        if (!service?.id || !selectedPropertyId) return;
        setLoading(true);
        const payload: UpdateServicePayload = {
            name: data.name,
            unitTypeId: parseInt(data.unitTypeId),
            price: data.price,
            propertyId: selectedPropertyId,
            description: data.description,
        };
        const result = await toastPromise(
            serviceService.updateService(service.id, payload),
            {
                loading: "Updating service...",
                success: "Service updated successfully!",
                error: "Failed to update service",
            }
        );
        setLoading(false);
        if (result) {
            closeModal();
            reload();
        }
    };

    return (
        <ActionModal
            isOpen={isOpen}
            closeModal={closeModal}
            title="Update Service"
            onConfirm={form.handleSubmit(onSubmit)}
            loading={loading}
        >
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md transition-all duration-200">
                        <div className="flex flex-col items-center gap-2">
                            <Spinner className="size-14 text-brand-300" />
                            <span className="text-sm text-muted-foreground">Loading data...</span>
                        </div>
                    </div>
                )}

                <div className={`flex flex-col gap-4 ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
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
                    <Controller
                        name="price"
                        control={form.control}
                        render={({ field }) => (
                            <PriceInput
                                label="Price"
                                required
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <TextArea
                        name="description"
                        label="Description"
                        placeholder="Enter description (optional)"
                    />
                </div>
            </div>
        </ActionModal>
    );
}

export default UpdateServiceModal;