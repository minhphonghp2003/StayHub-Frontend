import Input from '@/components/form/InputField';
import TextArea from '@/components/form/TextArea';
import ActionModal from '@/components/ui/modal/ActionModal';
import { RolePayload } from '@/core/payload/RBAC/role-payload';
import roleService from '@/core/service/RBAC/role-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
    name: string;
    code: string;
    description?: string;
};

function AddRoleModal({
    isOpen,
    closeModal,
    reload,
}: {
    isOpen: boolean;
    closeModal: any;
    reload?: any;
}) {

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            code: "",
            description: "",
        },
    });

    const handleAddrole: SubmitHandler<FormValues> = async (data) => {
        const payload: RolePayload = {
            name: data.name,
            description: data.description || undefined,
            code: data.code,
        };

        try {
            const result = await toastPromise(
                roleService.createrole(payload),
                {
                    loading: "Đang tạo role...",
                    success: "Tạo role thành công!",
                    error: "Tạo role thất bại!",
                }
            );

            if (result) {
                closeModal();
                reload?.();
                form.reset();
            }
        } catch {
            // error already displayed by toastPromise
        }
    };


    useEffect(() => {
        if (!isOpen) return;
        return () => {
            form.reset({
                name: "",
                code: "",
                description: "",
            });
        };
    }, [isOpen]);

    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleAddrole)}
            heading="Thêm mới role"
        >
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input {...form.register("name")} required label="Tên" />
                    <Input {...form.register("code")} required label="Mã" />
                </div>


                <TextArea {...form.register("description")} label="Mô tả" />
            </div>
        </ActionModal>
    );
}

export default AddRoleModal;
