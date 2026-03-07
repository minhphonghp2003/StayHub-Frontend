import Input from '@/components/form/InputField';
import { FormSelect } from '@/components/form/Select';
import Switch from '@/components/form/Switch';
import ActionModal from '@/components/ui/modal/ActionModal';
import { Spinner } from '@/components/ui/shadcn/spinner';
import { UpdateUnitPayload } from '@/core/payload/infra/update-unit-payload';
import { unitService } from '@/core/service/infra/unit-service';
import { unitGroupService } from '@/core/service/infra/unitGroup-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Unit } from '@/core/model/infra/unit';
import { UnitGroup } from '@/core/model/infra/unitGroup';

const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "OCCUPIED", label: "Occupied" },
    { value: "NOTICE_GIVEN", label: "Notice Given" },
    { value: "RESERVED", label: "Reserved" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "DRAFT", label: "Draft" },
];

type FormValues = {
    name: string;
    basePrice: number;
    maximumCustomer: number;
    unitGroupId: string;
};

function UpdateUnitModal({
    isOpen,
    closeModal,
    reload,
    unit,
}: {
    isOpen: boolean;
    closeModal: any;
    reload?: any;
    unit: Unit | null;
}) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [unitGroups, setUnitGroups] = useState<UnitGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            basePrice: 0,
            maximumCustomer: 1,
            unitGroupId: undefined,
        },
    });

    const handleUpdate: SubmitHandler<FormValues> = async (data) => {
        if (!unit) return;
        const payload: UpdateUnitPayload = {
            name: data.name,
            basePrice: data.basePrice,
            maximumCustomer: data.maximumCustomer,
            unitGroupId: parseInt(data.unitGroupId, 10),
        };

        try {
            const result = await toastPromise(
                unitService.updateUnit(unit.id ?? 0, payload),
                {
                    loading: "Updating unit...",
                    success: "Unit updated!",
                    error: "Failed to update unit",
                }
            );
            if (result) {
                closeModal();
                reload?.();
            }
        } catch { }
    };

    const fetchUnitGroups = async () => {
        if (!selectedPropertyId) return;
        const groups = await unitGroupService.getAllUnitGroupsNoPaging(selectedPropertyId);
        setUnitGroups(groups);
    };

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);

        Promise.all([
            unitService.getUnitById(unit?.id ?? 0),
            fetchUnitGroups(),
        ]).then(([unitDetailResponse]) => {

            form.reset({
                name: unitDetailResponse?.name ?? "",
                basePrice: unitDetailResponse?.basePrice ?? 0,
                maximumCustomer: unitDetailResponse?.maximumCustomer ?? 1,
                unitGroupId: unitDetailResponse?.unitGroup?.id?.toString() ?? unitDetailResponse?.unitGroupId?.toString() ?? "",
            });
            setIsLoading(false);
        });

        return () => {
            form.reset({
                name: "",
                basePrice: 0,
                maximumCustomer: 1,
                unitGroupId: "",
            });
        };
    }, [isOpen, unit]);


    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleUpdate)}
            heading="Update unit"
        >
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md transition-all duration-200">
                        <div className="flex flex-col items-center gap-2">
                            <Spinner className="size-14 text-brand-300" />
                            <span className="text-sm text-muted-foreground">Loading data...</span>
                        </div>
                    </div>
                )}

                <div className={`flex flex-col gap-4 ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
                    <div className="flex gap-2">
                        <Input {...form.register("name")} required label="Name" />
                        <FormSelect
                            name="unitGroupId"
                            control={form.control}
                            label="Unit Group"
                            required
                            options={unitGroups.map(g => ({ value: g.id?.toString(), label: g.name || "" }))}
                            placeholder="Select unit group"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Input {...form.register("basePrice", { valueAsNumber: true })} type="number" required label="Base Price" />
                        <Input {...form.register("maximumCustomer", { valueAsNumber: true })} type="number" required label="Max Customers" />
                    </div>


                </div>
            </div>
        </ActionModal>
    );
}

export default UpdateUnitModal;