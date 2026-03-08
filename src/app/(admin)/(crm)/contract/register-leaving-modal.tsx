"use client";

import { useForm, Controller } from "react-hook-form";
import DatePicker from "@/components/form/date-picker";
import ActionModal from "@/components/ui/modal/ActionModal";
import InputField from "@/components/form/InputField";
import TextArea from "@/components/form/TextArea";
// FormSelect removed; reason field no longer required
import { Contract } from "@/core/model/crm/contract";
import { RegisterLeavingCommand } from "@/core/model/crm/contract-commands";
import { contractService } from "@/core/service/crm/contract-service";
import { toastPromise } from "@/lib/alert-helper";
import { formatDate } from "@/lib/utils";

interface RegisterLeavingModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
    contract: Contract | null;
}

interface RegisterLeavingFormData {
    leavingDate: string;
}


function RegisterLeavingModal({ isOpen, closeModal, reload, contract }: RegisterLeavingModalProps) {
    const { control, register, handleSubmit, formState: { errors }, reset } = useForm<RegisterLeavingFormData>({
        defaultValues: {
            leavingDate: "",
        }
    });

    const onSubmit = async (data: RegisterLeavingFormData) => {
        if (!contract?.id) return;

        const command = RegisterLeavingCommand.fromContract(
            contract,
            data.leavingDate,
            undefined,
        );

        const result = await toastPromise(
            contractService.registerLeaving(command),
            {
                loading: "Đang đăng ký rời đi...",
                success: "Đăng ký rời đi thành công!",
                error: "Đăng ký rời đi thất bại!",
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
            heading="Đăng ký rời đi"
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

                {/* use custom date picker instead of native input */}
                <Controller
                    name="leavingDate"
                    control={control}
                    rules={{ required: "Vui lòng chọn ngày rời đi" }}
                    render={({ field }) => (
                        <DatePicker
                            id="leaving-date"
                            label="Ngày rời đi"
                            placeholder="Chọn ngày rời đi"
                            defaultDate={field.value || undefined}
                            onChange={(selectedDates: any) => {
                                if (selectedDates[0]) {
                                    const date = new Date(selectedDates[0]);
                                    const formatted = date.toISOString();
                                    field.onChange(formatted);
                                }
                            }}
                            error={errors.leavingDate?.message as string | undefined}
                            required
                        />
                    )}
                />


            </div>
        </ActionModal>
    );
}

export default RegisterLeavingModal;