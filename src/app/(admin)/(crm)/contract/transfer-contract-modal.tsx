"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "@/components/form/date-picker";
import ActionModal from "@/components/ui/modal/ActionModal";
import InputField from "@/components/form/InputField";
import TextArea from "@/components/form/TextArea";
import { FormSelect } from "@/components/form/Select";
import { Contract } from "@/core/model/crm/contract";
import { Customer } from "@/core/model/crm/customer";
import { createTransferContractCommand } from "@/core/model/crm/contract-commands";
import { contractService } from "@/core/service/crm/contract-service";
import { customerService } from "@/core/service/crm/customer-service";
import { toastPromise } from "@/lib/alert-helper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatDate } from "@/lib/utils";

interface TransferContractModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
    contract: Contract | null;
}

interface TransferFormData {
    newCustomerId: string;
    transferDate: string;
}

function TransferContractModal({ isOpen, closeModal, reload, contract }: TransferContractModalProps) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    const { control, register, handleSubmit, formState: { errors }, reset } = useForm<TransferFormData>({
        defaultValues: {
            newCustomerId: "",
            transferDate: "",
        }
    });

    useEffect(() => {
        if (isOpen && selectedPropertyId) {
            loadCustomers();
        }
    }, [isOpen, selectedPropertyId]);

    const loadCustomers = async () => {
        if (!selectedPropertyId) return;

        setLoading(true);
        const result = await customerService.getAllCustomers({ propertyId: selectedPropertyId });
        if (result) {
            // Filter out current customers of this contract
            const currentCustomerIds = contract?.customer?.map(c => c.id) || [];
            const availableCustomers = result.data?.filter(customer =>
                !currentCustomerIds.includes(customer.id)
            ) || [];
            setCustomers(availableCustomers);
        }
        setLoading(false);
    };

    const onSubmit = async (data: TransferFormData) => {
        if (!contract?.id || !data.newCustomerId) return;

        const payload = createTransferContractCommand(
            contract,
            parseInt(data.newCustomerId),
            data.transferDate
        );

        const result = await toastPromise(
            contractService.transferContract(payload),
            {
                loading: "Đang chuyển nhượng hợp đồng...",
                success: "Chuyển nhượng hợp đồng thành công!",
                error: "Chuyển nhượng hợp đồng thất bại!",
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

    const customerOptions = customers.map(customer => ({
        value: customer.id?.toString() || "",
        label: `${customer.name} ${customer.phone ? `(${customer.phone})` : ''}`
    }));

    const currentCustomers = contract?.customer?.map(c => c.name).join(", ") || "N/A";

    return (
        <ActionModal
            isOpen={isOpen}
            closeModal={handleClose}
            onConfirm={handleSubmit(onSubmit)}
            heading="Chuyển nhượng hợp đồng"
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

                <FormSelect
                    name="newCustomerId"
                    control={control}
                    required
                    label="Chọn khách thuê mới"
                    options={customerOptions}
                    placeholder="Chọn khách thuê..."
                    disabled={loading}
                />

                <Controller
                    name="transferDate"
                    control={control}
                    rules={{ required: "Vui lòng chọn ngày chuyển nhượng" }}
                    render={({ field }) => (
                        <DatePicker
                            id="transfer-date"
                            label="Ngày chuyển nhượng"
                            placeholder="Chọn ngày chuyển nhượng"
                            defaultDate={field.value || undefined}
                            onChange={(selectedDates: any) => {
                                if (selectedDates[0]) {
                                    const date = new Date(selectedDates[0]);
                                    const formatted = date.toISOString();
                                    field.onChange(formatted);
                                }
                            }}
                            error={errors.transferDate?.message as string | undefined}
                            required
                        />
                    )}
                />

            </div>
        </ActionModal>
    );
}

export default TransferContractModal;