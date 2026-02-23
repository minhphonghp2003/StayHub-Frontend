"use client";
import Loading from "@/components/common/Loading";
import Input from "@/components/form/InputField";
import TextArea from "@/components/form/TextArea";
import ActionModal from "@/components/ui/modal/ActionModal";
import { Tier } from "@/core/model/tier/tier";
import { UpdateTierPayload } from "@/core/payload/tier/update-tier-payload";
import { tierService } from "@/core/service/tier/tier-service";
import { showToast, toastPromise } from "@/lib/alert-helper";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
    name: string;
    code?: string;
    description?: string;
    price: number;
    billingCycle: string;
};

function UpdateTierModal({
    isOpen,
    closeModal,
    tier,
    reload,
}: {
    isOpen: boolean;
    closeModal: any;
    tier?: Tier | null;
    reload: any;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const form = useForm<FormValues>();

    const handleSubmitForm: SubmitHandler<FormValues> = async (data) => {
        const payload: UpdateTierPayload = {
            name: data.name,
            code: data.code || undefined,
            description: data.description || undefined,
            price: data.price,
            billingCycle: data.billingCycle,
        };

        try {
            const result = await toastPromise(
                tierService.updateTier(tier?.id ?? 0, payload),
                {
                    loading: "Cập nhật tier...",
                    success: "Cập nhật tier thành công!",
                    error: "Cập nhật tier thất bại!",
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

        tierService.getTierById(tier?.id ?? 0).then((tierDetail) => {
            form.reset({
                name: tierDetail?.name ?? "",
                code: tierDetail?.code ?? "",
                description: tierDetail?.description ?? "",
                price: tierDetail?.price ?? 0,
                billingCycle: tierDetail?.billingCycle ?? "monthly",
            });
            setIsLoading(false);
        });

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
            onConfirm={form.handleSubmit(handleSubmitForm)}
            heading={`Cập nhật gói dịch vụ ${tier?.name || ""}`}
        >
            {isLoading && <Loading />}
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

export default UpdateTierModal;
