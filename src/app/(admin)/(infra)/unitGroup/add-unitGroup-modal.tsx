import Input from '@/components/form/InputField';
import ActionModal from '@/components/ui/modal/ActionModal';
import { AddUnitGroupPayload } from '@/core/payload/infra/add-unitGroup-payload';
import { unitGroupService } from '@/core/service/infra/unitGroup-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type FormValues = {
    name: string;
};

function AddUnitGroupModal({
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

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
        },
    });

    const handleAdd: SubmitHandler<FormValues> = async (data) => {
        if (!selectedPropertyId) {
            // property must be selected before creating
            return;
        }
        const payload: AddUnitGroupPayload = {
            name: data.name,
            propertyId: selectedPropertyId,
        };

        try {
            const result = await toastPromise(
                unitGroupService.createUnitGroup(payload),
                {
                    loading: "Đang tạo khu/tầng/dãy  ...",
                    success: " Khu/tầng/dãy đã được tạo!",
                    error: " Tạo khu/tầng/dãy thất bại",
                }
            );
            if (result) {
                closeModal();
                reload?.();
                form.reset();
            }
        } catch {
            // toastPromise shows error
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        return () => {
            form.reset({ name: "" });
        };
    }, [isOpen]);

    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleAdd)}
            heading="Thêm khu/tầng/dãy mới"
        >
            <div className="flex flex-col gap-4">
                <Input {...form.register('name')} required label="Tên khu/tầng/dãy" />
            </div>
        </ActionModal>
    );
}

export default AddUnitGroupModal;