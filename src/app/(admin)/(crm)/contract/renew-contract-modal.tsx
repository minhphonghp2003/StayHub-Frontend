"use client";

import { useForm, Controller } from "react-hook-form";
import DatePicker from "@/components/form/date-picker";
import ActionModal from "@/components/ui/modal/ActionModal";
import InputField from "@/components/form/InputField";
import TextArea from "@/components/form/TextArea";
import PriceInput from "@/components/form/PriceInput";
import { Contract } from "@/core/model/crm/contract";
import { createRenewContractCommand } from "@/core/model/crm/contract-commands";
import { contractService } from "@/core/service/crm/contract-service";
import { toastPromise } from "@/lib/alert-helper";
import { formatDate } from "@/lib/utils";

interface RenewContractModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
    contract: Contract | null;
}

interface RenewFormData {
    newDate: string;
    newPrice?: number;
    newDeposit?: number;

}

function RenewContractModal({ isOpen, closeModal, reload, contract }: RenewContractModalProps) {
    const { register, control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<RenewFormData>({
        defaultValues: {
            newDate: "",
            newPrice: undefined,
            newDeposit: undefined,
        }
    });

    const onSubmit = async (data: RenewFormData) => {
        if (!contract?.id) return;

        const payload = createRenewContractCommand(
            contract,
            data.newDate,
            data.newPrice,
            data.newDeposit
        );

        const result = await toastPromise(
            contractService.renewContract(payload),
            {
                loading: "Đang gia hạn hợp đồng...",
                success: "Gia hạn hợp đồng thành công!",
                error: "Gia hạn hợp đồng thất bại!",
            }
        );

        if (result) {
            closeModal();
            reset();
            reload();
        }
    };

    const handleClose = () => {
        closeModal();
        reset();
    };

    return (
        <ActionModal
            isOpen={isOpen}
            closeModal={handleClose}
            onConfirm={handleSubmit(onSubmit)}
            heading="Gia hạn hợp đồng"
        >
            <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 text-lg dark:text-gray-100 mb-4">Thông tin hợp đồng</h5>
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-4" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Mã HĐ:</span> {contract?.code}
                        </div>
                        <div>
                            <span className="font-medium">Phòng:</span> {contract?.unit?.name}
                        </div>

                        <div>
                            <span className="font-medium">Giá:</span> {contract?.price ? contract.price.toLocaleString("vi-VN") + ' ₫' : 'N/A'}
                        </div>
                        <div>
                            <span className="font-medium">Cọc:</span> {contract?.deposit ? contract.deposit.toLocaleString("vi-VN") + ' ₫' : 'N/A'}
                        </div>
                        <div>
                            <span className="font-medium">Khách thuê:</span> {contract?.customer?.map(c => c.name).join(", ") || 'N/A'}
                        </div>
                        <div>
                            <span className="font-medium">Ngày kết thúc:</span> {contract?.endDate ? formatDate(contract.endDate) : 'N/A'}
                        </div>
                    </div>
                </div>

                <Controller
                    name="newDate"
                    control={control}
                    rules={{ required: "Vui lòng chọn ngày kết thúc mới" }}
                    render={({ field }) => (
                        <DatePicker
                            id="new-end-date"
                            label="Ngày kết thúc mới"
                            placeholder="Chọn ngày kết thúc mới"
                            defaultDate={field.value || undefined}
                            onChange={(selectedDates: any) => {
                                if (selectedDates[0]) {
                                    const date = new Date(selectedDates[0]);
                                    const formatted = date.toISOString();
                                    field.onChange(formatted);
                                }
                            }}
                            error={errors.newDate?.message as string | undefined}
                            required
                        />
                    )}
                />

                <Controller
                    name="newPrice"
                    control={control}
                    render={({ field }) => (
                        <PriceInput
                            label="Giá mới (tùy chọn)"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Để trống nếu giữ nguyên giá"
                        />
                    )}
                />


            </div>
        </ActionModal>
    );
}

export default RenewContractModal;