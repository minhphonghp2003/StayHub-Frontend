import Input from '@/components/form/InputField';
import TextArea from '@/components/form/TextArea';
import ActionModal from '@/components/ui/modal/ActionModal';
import { Spinner } from '@/components/ui/shadcn/spinner';
import { Role } from '@/core/model/RBAC/Role';
import { RolePayload } from '@/core/payload/RBAC/role-payload';
import roleService from '@/core/service/RBAC/role-service';
import { showToast, toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
    name: string;
    code: string;
    description?: string;
};

function UpdateRoleModal({ isOpen, closeModal, role, reload }: { isOpen: boolean, closeModal: any, role?: Role | null, reload: any }) {
    let [isLoading, setIsLoading] = useState(true)
    const form = useForm<FormValues>();

    const handleSubmitForm: SubmitHandler<FormValues> = async (data,) => {
        const payload: RolePayload = {
            name: data.name,
            code: data.code,
            description: data.description || undefined,
        };
        try {
            const result = await toastPromise(
                roleService.updaterole(role?.id ?? 0, payload),
                {
                    loading: "Cập nhật role...",
                    success: "Cập nhật role thành công!",
                    error: "Cập nhật role thất bại!",
                }
            );
            if (result) {
                closeModal();
                reload();
                form.reset()
            }
        } catch (err) {
            showToast({ type: "error", content: "Có lỗi xảy ra" })
        }

    };
    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);

        Promise.all([
            roleService.getroleById(role?.id ?? 0),
        ]).then(([roleDetailResponse]) => {

            form.reset({
                name: roleDetailResponse?.name ?? "",
                code: roleDetailResponse?.code ?? "",
                description: roleDetailResponse?.description ?? "",

            });
            setIsLoading(false);
        });

        return () => {
            form.reset({
                name: "",
                code: "",
                description: "",
            })
        };
    }, [isOpen])

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={form.handleSubmit(handleSubmitForm)} heading={"Cập nhật role"} >
            <div className="relative">

                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md transition-all duration-200">
                        <div className="flex flex-col items-center gap-2">
                            <Spinner className="size-14 text-brand-300" />
                            <span className="text-sm text-muted-foreground">Đang tải dữ liệu...</span>
                        </div>
                    </div>
                )}

                <div className={`flex flex-col gap-4 ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
                    <div className="flex gap-2 justify-between items-center">
                        <Input {...form.register("name")} required label="Tên" type="text" />
                        <Input {...form.register("code")} required label="Mã" type="text" />
                    </div>



                    <TextArea {...form.register("description")} label="Mô tả" />
                </div>
            </div>
        </ActionModal>
    )
}

export default UpdateRoleModal

