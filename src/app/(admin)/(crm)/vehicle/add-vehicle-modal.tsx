"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import ActionModal from "@/components/ui/modal/ActionModal";
import Input from "@/components/form/InputField";
import { FormSelect } from "@/components/form/Select";
import { toastPromise } from "@/lib/alert-helper";
import { RootState } from "@/redux/store";
import { AddVehiclePayload } from "@/core/payload/crm/add-vehicle-payload";
import { vehicleService } from "@/core/service/crm/vehicle-service";
import { customerService } from "@/core/service/crm/customer-service";
import { Customer } from "@/core/model/crm/customer";

interface AddVehicleModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
    customerId: number;
}

type FormValues = {
    customerId: string;
    name: string;
    licensePlate: string;
    image?: string;
};

function AddVehicleModal({ isOpen, closeModal, reload, customerId }: AddVehicleModalProps) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        defaultValues: {
            customerId: customerId?.toString() || "",
            name: "",
            licensePlate: "",
            image: "",
        },
    });

    const fetchCustomers = async () => {
        if (!selectedPropertyId) return;
        const result = await customerService.getAllCustomers({
            propertyId: selectedPropertyId,
            pageSize: 10000, // Fetch large page size to get all customers
        });
        if (result) {
            setCustomers(result.data ?? []);
        }
    };

    useEffect(() => {
        if (isOpen && selectedPropertyId) {
            fetchCustomers();
        }
    }, [isOpen, selectedPropertyId]);

    useEffect(() => {
        form.setValue("customerId", customerId?.toString() || "");
    }, [customerId, form]);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        const payload: AddVehiclePayload = {
            customerId: parseInt(data.customerId),
            name: data.name,
            licensePlate: data.licensePlate,
            image: data.image || undefined,
        };

        const result = await toastPromise(vehicleService.createVehicle(payload), {
            loading: "Đang tạo xe...",
            success: "Xe đã được tạo!",
            error: "Tạo xe thất bại",
        });
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
            heading="Thêm xe"
            onConfirm={form.handleSubmit(onSubmit)}
            loading={loading}
        >
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-lg">Thông tin xe</h3>
                {customers.length > 0 && (
                    <FormSelect
                        name="customerId"
                        control={form.control}
                        label="Chủ xe"
                        options={customers.map(c => ({ value: c.id?.toString(), label: c.name ?? "" }))}
                        placeholder="Chọn chủ xe"
                    />
                )}
                <div className="flex gap-2">
                    <Input {...form.register("name")} required label="Tên xe" />
                    <Input {...form.register("licensePlate")} required label="Biển số" />
                </div>
                <div>
                    <Input {...form.register("image")} label="Hình ảnh (URL)" />
                </div>
            </div>
        </ActionModal>
    );
}

export default AddVehicleModal;
