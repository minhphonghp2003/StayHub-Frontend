import Input from '@/components/form/InputField';
import ActionModal from '@/components/ui/modal/ActionModal';
import { UpdateUnitGroupPayload } from '@/core/payload/infra/update-unitGroup-payload';
import { unitGroupService } from '@/core/service/infra/unitGroup-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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
        mode: "onChange",
        resolver: async (values) => {
            const errors: any = {};

            if (!values.name?.trim()) {
                errors.name = { message: "Vui lòng nhập tên khu/tầng/dãy" };
            }

            return {
                values,
                errors,
            };
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
                    loading: "Đang cập nhật khu/tầng/dãy...",
                    success: "Cập nhật khu/tầng/dãy thành công!",
                    error: "Cập nhật khu/tầng/dãy thất bại",
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
            heading="Cập nhật khu/tầng/dãy"
        >
            <div className="flex flex-col gap-4">
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            required
                            label="Tên khu/tầng/dãy"
                            errorMessage={form.formState.errors.name?.message}
                        />
                    )}
                />
            </div>
        </ActionModal>
    );
}

export default UpdateUnitGroupModal;