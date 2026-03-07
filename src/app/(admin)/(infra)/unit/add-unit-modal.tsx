import Input from '@/components/form/InputField';
import PriceInput from '@/components/form/PriceInput';
import { FormSelect } from '@/components/form/Select';
import Switch from '@/components/form/Switch';
import ActionModal from '@/components/ui/modal/ActionModal';
import { AddUnitPayload } from '@/core/payload/infra/add-unit-payload';
import { unitService } from '@/core/service/infra/unit-service';
import { unitGroupService } from '@/core/service/infra/unitGroup-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UnitGroup } from '@/core/model/infra/unitGroup';
type FormValues = {
    name: string;
    basePrice: number;
    maximumCustomer: number;
    isActive: boolean;
    unitGroupId: number;
};

function AddUnitModal({
    isOpen,
    closeModal,
    reload,
}: {
    isOpen: boolean;
    closeModal: any;
    reload?: any;
}) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [unitGroups, setUnitGroups] = useState<UnitGroup[]>([]);

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            basePrice: 0,
            maximumCustomer: 1,
            isActive: true,
            unitGroupId: undefined,
        },
    });

    const handleAdd: SubmitHandler<FormValues> = async (data) => {
        if (!selectedPropertyId) return;
        const payload: AddUnitPayload = {
            name: data.name,
            basePrice: data.basePrice,
            maximumCustomer: data.maximumCustomer,
            isActive: data.isActive,
            unitGroupId: data.unitGroupId,
            propertyId: selectedPropertyId,
        };

        try {
            const result = await toastPromise(
                unitService.createUnit(payload),
                {
                    loading: "Đang tạo phòng...",
                    success: "Tạo phòng thành công!",
                    error: "Tạo phòng thất bại",
                }
            );
            if (result) {
                closeModal();
                reload?.();
                form.reset();
            }
        } catch { }
    };

    const fetchUnitGroups = async () => {
        if (!selectedPropertyId) return;
        const groups = await unitGroupService.getAllUnitGroupsNoPaging(selectedPropertyId);
        setUnitGroups(groups);
    };

    useEffect(() => {
        if (isOpen) {
            fetchUnitGroups();
        }
        return () => {
            form.reset({
                name: "",
                basePrice: 0,
                maximumCustomer: 1,
                isActive: true,
                unitGroupId: undefined,
            });
        };
    }, [isOpen]);


    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleAdd)}
            heading="Thêm phòng"
        >
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input {...form.register("name")} required label="Tên phòng " />
                    <FormSelect
                        name="unitGroupId"
                        control={form.control}
                        label="Khu/tầng/dãy"
                        required
                        options={unitGroups.map(g => ({ value: g.id?.toString(), label: g.name || "" }))}
                        placeholder="Select unit group"
                    />
                </div>
                <div className="flex gap-2">
                    <Controller
                        name="basePrice"
                        control={form.control}
                        render={({ field }) => (
                            <PriceInput
                                label="Giá cơ bản"
                                required
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <Input {...form.register("maximumCustomer", { valueAsNumber: true })} type="number" required label="Số khách tối đa " />
                </div>

                <Controller
                    name="isActive"
                    control={form.control}
                    render={({ field }) => (
                        <Switch
                            label="Hoạt động"
                            defaultChecked={field.value}
                            onChange={(checked) => field.onChange(checked)}
                        />
                    )}
                />
            </div>
        </ActionModal>
    );
}

export default AddUnitModal;