"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import ActionModal from "@/components/ui/modal/ActionModal";
import Input from "@/components/form/InputField";
import { FormSelect } from "@/components/form/Select";
import { toastPromise } from "@/lib/alert-helper";
import { RootState } from "@/redux/store";
import { UpdateVehiclePayload } from "@/core/payload/crm/update-vehicle-payload";
import { vehicleService } from "@/core/service/crm/vehicle-service";
import { customerService } from "@/core/service/crm/customer-service";
import { Customer } from "@/core/model/crm/customer";
import Loading from "@/components/common/Loading";

interface UpdateVehicleModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
    vehicleId: number;
}

type FormValues = {
    customerId: string;
    name: string;
    licensePlate: string;
    image?: string;
};

function UpdateVehicleModal({ isOpen, closeModal, reload, vehicleId }: UpdateVehicleModalProps) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    const form = useForm<FormValues>({
        defaultValues: {
            customerId: "",
            name: "",
            licensePlate: "",
            image: "",
        },
    });

    const fetchInitialData = async () => {
        setInitialLoading(true);
        const vehicle = await vehicleService.getVehicleById(vehicleId);
        if (vehicle) {
            form.reset({
                customerId: vehicle.customerId?.toString() || "",
                name: vehicle.name,
                licensePlate: vehicle.licensePlate,
                image: vehicle.image || "",
            });
        }
        setInitialLoading(false);
    };

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
            fetchInitialData();
            fetchCustomers();
        }
    }, [isOpen, vehicleId, selectedPropertyId]);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        const payload: UpdateVehiclePayload = {
            customerId: parseInt(data.customerId),
            name: data.name,
            licensePlate: data.licensePlate,
            image: data.image || undefined,
        };

        const result = await toastPromise(vehicleService.updateVehicle(vehicleId, payload), {
            loading: "Đang cập nhật xe...",
            success: "Xe đã được cập nhật!",
            error: "Cập nhật xe thất bại",
        });
        setLoading(false);
        if (result) {
            closeModal();
            reload();
        }
    };

    if (initialLoading) {
        return (
            <ActionModal isOpen={isOpen} closeModal={closeModal} heading="Cập nhật xe">
                <Loading />
            </ActionModal>
        );
    }

    return (
        <ActionModal
            isOpen={isOpen}
            closeModal={closeModal}
            heading="Cập nhật xe"
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

export default UpdateVehicleModal;
