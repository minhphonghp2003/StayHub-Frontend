"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ActionModal from "@/components/ui/modal/ActionModal";
import { FormSelect } from "@/components/form/Select";
import TextArea from "@/components/form/TextArea";
import { Contract } from "@/core/model/crm/contract";
import { Unit } from "@/core/model/infra/unit";
import { ChangeRoomCommand } from "@/core/model/crm/contract-commands";
import { contractService } from "@/core/service/crm/contract-service";
import { unitService } from "@/core/service/infra/unit-service";
import { toastPromise } from "@/lib/alert-helper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatDate } from "@/lib/utils";

interface ChangeRoomModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
    contract: Contract | null;
}

interface ChangeRoomFormData {
    newUnitId: string;
}

function ChangeRoomModal({ isOpen, closeModal, reload, contract }: ChangeRoomModalProps) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);

    const { control, register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ChangeRoomFormData>({
        defaultValues: {
            newUnitId: "",
        }
    });

    useEffect(() => {
        if (isOpen && selectedPropertyId) {
            loadUnits();
        }
    }, [isOpen, selectedPropertyId]);

    const loadUnits = async () => {
        if (!selectedPropertyId) return;

        setLoading(true);
        const result = await unitService.getAllUnits({ propertyId: selectedPropertyId });
        if (result) {
            // Filter out the current unit
            const availableUnits = result.data?.filter(unit => unit.id !== contract?.unitId) || [];
            setUnits(availableUnits);
        }
        setLoading(false);
    };

    const onSubmit = async (data: ChangeRoomFormData) => {
        if (!contract?.id || !data.newUnitId) return;

        const result = await toastPromise(
            contractService.changeRoom(contract.id, parseInt(data.newUnitId)),
            {
                loading: "Đang chuyển phòng...",
                success: "Chuyển phòng thành công!",
                error: "Chuyển phòng thất bại!",
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

    const unitOptions = units.map(unit => ({
        value: unit.id?.toString() || "",
        label: unit.name || ""
    }));

    return (
        <ActionModal
            isOpen={isOpen}
            closeModal={handleClose}
            onConfirm={handleSubmit(onSubmit)}
            heading="Chuyển phòng"
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
                    name="newUnitId"
                    required
                    control={control}
                    label="Chọn phòng mới"
                    options={unitOptions}
                    placeholder="Chọn phòng..."
                    disabled={loading}
                />

            </div>
        </ActionModal>
    );
}

export default ChangeRoomModal;