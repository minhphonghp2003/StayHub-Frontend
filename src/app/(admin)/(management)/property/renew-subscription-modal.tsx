"use client";
import DatePicker from "@/components/form/date-picker";
import { FormSelect } from "@/components/form/Select";
import ActionModal from "@/components/ui/modal/ActionModal";
import { Property } from "@/core/model/pmm/property";
import { Tier } from "@/core/model/tier/tier";
import { tierService } from "@/core/service/tier/tier-service";
import { showToast, toastPromise } from "@/lib/alert-helper";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
    tierId: number;
    startTime: string;
    endTime: string;
};

// Helper function to format date as ISO string without timezone offset
const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00Z`;
};

function RenewSubscriptionModal({
    isOpen,
    closeModal,
    property,
    reload,
    tiers = [],
}: {
    isOpen: boolean;
    closeModal: any;
    property: Property | null;
    reload?: any;
    tiers?: Tier[];
}) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        defaultValues: {
            tierId: property?.tierId,
            startTime: undefined,
            endTime: undefined,
        },
    });

    const handleRenewSubscription: SubmitHandler<FormValues> = async (data) => {
        if (!property?.id) {
            showToast({ type: "error", content: "Property ID not found" });
            return;
        }

        setIsLoading(true);
        try {
            const startDate = new Date(data.startTime);
            const endDate = new Date(data.endTime);

            const result = await toastPromise(
                tierService.renewSubscription(
                    property.id,
                    data.tierId,
                    formatDateForAPI(startDate),
                    formatDateForAPI(endDate)
                ),
                {
                    loading: "Đang gia hạn hợp đồng...",
                    success: "Gia hạn hợp đồng thành công!",
                    error: "Gia hạn hợp đồng thất bại!",
                }
            );

            if (result) {
                closeModal();
                reload?.();
                form.reset();
            }
        } catch {
            // error already displayed by toastPromise
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        form.reset({
            tierId: property?.tierId,
            startTime: undefined,
            endTime: undefined,
        });
    }, [isOpen, property]);

    return (
        <ActionModal
            size="lg"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleRenewSubscription)}
            heading={`Gia hạn hợp đồng - ${property?.name}`}
            isLoading={isLoading}
        >
            <div className="flex flex-col gap-4 overflow-y-auto">
                <FormSelect
                    name="tierId"
                    control={form.control}
                    label="Gói dịch vụ"
                    required
                    options={tiers.map((tier) => ({
                        value: tier.id?.toString() || "",
                        label: tier.name || "",
                    }))}
                />

                <div className="flex justify-between gap-2">
                    <Controller
                        control={form.control}
                        name="startTime"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <DatePicker
                                id="startTime"
                                label="Ngày bắt đầu"
                                defaultDate={field.value ? new Date(field.value) : undefined}
                                onChange={(selectedDates: Date[], _dateStr: string) =>
                                    field.onChange(selectedDates && selectedDates[0] ? formatDateForAPI(selectedDates[0]) : undefined)
                                }
                            />
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="endTime"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <DatePicker
                                id="endTime"
                                label="Ngày kết thúc"
                                defaultDate={field.value ? new Date(field.value) : undefined}
                                onChange={(selectedDates: Date[], _dateStr: string) =>
                                    field.onChange(selectedDates && selectedDates[0] ? formatDateForAPI(selectedDates[0]) : undefined)
                                }
                            />
                        )}
                    />
                </div>
            </div>
        </ActionModal>
    );
}

export default RenewSubscriptionModal;
