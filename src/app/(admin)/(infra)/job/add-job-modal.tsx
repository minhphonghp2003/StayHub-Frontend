import Input from '@/components/form/InputField';
import { FormSelect } from '@/components/form/Select';
import Switch from '@/components/form/Switch';
import ActionModal from '@/components/ui/modal/ActionModal';
import { AddJobPayload } from '@/core/payload/infra/add-job-payload';
import { jobService } from '@/core/service/infra/job-service';
import { unitService } from '@/core/service/infra/unit-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Unit } from '@/core/model/infra/unit';

type FormValues = {
    name: string;
    unitId?: string;
    description: string;
    isActive: boolean;
};

function AddJobModal({
    isOpen,
    onClose,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [units, setUnits] = useState<Unit[]>([]);

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            unitId: undefined,
            description: "",
            isActive: true,
        },
    });

    const handleAdd: SubmitHandler<FormValues> = async (data) => {
        if (!selectedPropertyId) return;
        const payload: AddJobPayload = {
            name: data.name,
            propertyId: selectedPropertyId,
            unitId: data.unitId ? parseInt(data.unitId) : undefined,
            description: data.description,
            isActive: data.isActive,
        };
        try {
            const result = await toastPromise(
                jobService.createJob(payload),
                {
                    loading: "Creating job...",
                    success: "Job created!",
                    error: "Failed to create job",
                }
            );
            if (result) {
                onClose();
                onSuccess?.();
                form.reset();
            }
        } catch { }
    };

    const fetchUnits = async () => {
        if (!selectedPropertyId) return;
        const list = await unitService.getAllUnitsNoPaging(selectedPropertyId);
        setUnits(list);
    };

    useEffect(() => {
        if (isOpen) {
            fetchUnits();
        }
        return () => {
            form.reset({
                name: "",
                unitId: undefined,
                description: "",
                isActive: true,
            });
        };
    }, [isOpen]);

    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={onClose}
            onConfirm={form.handleSubmit(handleAdd)}
            heading="Add job"
        >
            <div className="flex flex-col gap-4">
                <Input {...form.register("name")} required label="Name" />
                <FormSelect
                    name="unitId"
                    control={form.control}
                    label="Unit (optional)"
                    options={units.map(u => ({ value: u.id?.toString(), label: u.name || "" }))}
                    placeholder="Select unit"
                />
                <Input {...form.register("description")} label="Description" />
                <Controller
                    name="isActive"
                    control={form.control}
                    render={({ field }) => (
                        <Switch
                            label="Active"
                            defaultChecked={field.value}
                            onChange={(checked) => field.onChange(checked)}
                        />
                    )}
                />
            </div>
        </ActionModal>
    );
}

export default AddJobModal;
