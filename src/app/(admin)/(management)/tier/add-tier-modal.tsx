"use client";
import Input from "@/components/form/InputField";
import TextArea from "@/components/form/TextArea";
import ActionModal from "@/components/ui/modal/ActionModal";
import { AddTierPayload } from "@/core/payload/tier/add-tier-payload";
import { tierService } from "@/core/service/tier/tier-service";
import { showToast, toastPromise } from "@/lib/alert-helper";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
    name: string;
    code?: string;
    description?: string;
    price: number;
    billingCycle: string;
};

function AddTierModal({
    isOpen,
    closeModal,
    reload,
}: {
    isOpen: boolean;
    closeModal: any;
    reload?: any;
}) {
    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            code: "",
            description: "",
            price: 0,
            billingCycle: "monthly",
        },
    });

    const handleAddTier: SubmitHandler<FormValues> = async (data) => {
        const payload: AddTierPayload = {
            name: data.name,
            code: data.code || undefined,
            description: data.description || undefined,
            price: data.price,
            billingCycle: data.billingCycle,
        };

        try {
            const result = await toastPromise(
                tierService.createTier(payload),
                {
                    loading: "Đang tạo tier...",
                    success: "Tạo tier thành công!",
                    error: "Tạo tier thất bại!",
                }
            );

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
        return () => {
            form.reset({
                name: "",
                code: "",
                description: "",
                price: 0,
                billingCycle: "monthly",
            });
        };
    }, [isOpen]);

    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleAddTier)}
            heading="Thêm mới gói dịch vụ"
        >
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input {...form.register("name")} required label="Tên" />
                    <Input {...form.register("code")} label="Mã" />
                </div>

                <div className="flex gap-2">
                    <Input
                        {...form.register("price", { valueAsNumber: true })}
                        required
                        label="Giá"
                        type="number"
                        step="0.01"
                    />
                    <Input
                        {...form.register("billingCycle")}
                        required
                        label="Chu kỳ thanh toán"
                        placeholder="monthly, yearly"
                    />
                </div>

                <TextArea
                    {...form.register("description")}
                    label="Mô tả (phân tách bằng dấu phẩy)"
                    placeholder="Tính năng 1, Tính năng 2, Tính năng 3"
                />
            </div>
        </ActionModal>
    );
}

export default AddTierModal;
