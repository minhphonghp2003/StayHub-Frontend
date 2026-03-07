import Input from '@/components/form/InputField';
import ActionModal from '@/components/ui/modal/ActionModal';
import { UpdateUnitGroupPayload } from '@/core/payload/infra/update-unitGroup-payload';
import { unitGroupService } from '@/core/service/infra/unitGroup-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UnitGroup } from '@/core/model/infra/unitGroup';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type FormValues = {
    name: string;
};

function UpdateUnitGroupModal({
    isOpen,
    closeModal,
    reload,
    unitGroup,
}: {
    isOpen: boolean;
    closeModal: any;
    reload?: any;
    unitGroup: UnitGroup | null;
}) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
        },
    });

    const handleUpdate: SubmitHandler<FormValues> = async (data) => {
        if (!unitGroup) return;
        const payload: UpdateUnitGroupPayload = {
            name: data.name,
            // propertyId is immutable after creation, but we send same value
            propertyId: selectedPropertyId ?? unitGroup.propertyId ?? 0,
        };

        try {
            const result = await toastPromise(
                unitGroupService.updateUnitGroup(unitGroup.id ?? 0, payload),
                {
                    loading: "Updating...",
                    success: "Unit group updated!",
                    error: "Failed to update unit group",
                }
            );
            if (result) {
                closeModal();
                reload?.();
            }
        } catch { }
    };

    useEffect(() => {
        if (isOpen && unitGroup) {
            form.reset({ name: unitGroup.name ?? "" });
        }
    }, [isOpen, unitGroup]);

    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleUpdate)}
            heading="Update unit group"
        >
            <div className="flex flex-col gap-4">
                <Input {...form.register('name')} required label="Name" />
            </div>
        </ActionModal>
    );
}

export default UpdateUnitGroupModal;