import Input from '@/components/form/InputField'
import TextArea from '@/components/form/TextArea'
import ActionModal from '@/components/ui/modal/ActionModal'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { Category } from '@/core/model/catalog/category'
import { UpdateCategoryPayload } from '@/core/payload/catalog/update-category-payload'
import { categoryService } from '@/core/service/catalog/category-service'
import { toastPromise } from '@/lib/alert-helper'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
type FormValues = {
    name: string;
    code: string;
    description?: string;
};
function UpdateCategoryModal({ isOpen, closeModal, category, reload }: { isOpen: boolean, closeModal: any, category?: Category | null, reload: any }) {

    let [isLoading, setIsLoading] = useState(true)
    const form = useForm<FormValues>({
        mode: "onChange",
        resolver: async (values) => {
            const errors: any = {};

            if (!values.name?.trim()) {
                errors.name = { message: "Vui lòng nhập tên category" };
            }

            if (!values.code?.trim()) {
                errors.code = { message: "Vui lòng nhập mã category" };
            }

            return {
                values,
                errors,
            };
        },
    });

    const handleSubmitForm: SubmitHandler<FormValues> = async (data,) => {
        const payload: UpdateCategoryPayload = {
            name: data.name,
            code: data.code,
            description: data.description || undefined,
        };
        try {
            const result = await toastPromise(
                categoryService.updateCategory(category?.id ?? 0, payload),
                {
                    loading: "Cập nhật category...",
                    success: "Cập nhật category thành công!",
                    error: "Cập nhật category thất bại!",
                }
            );
            if (result) {
                closeModal();
                reload();
                form.reset()
            }
        } catch (err) {
            // error already displayed by toastPromise
        }

    };
    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);

        Promise.all([
            categoryService.getCategoryById(category?.id ?? 0),

        ]).then(([menuDetailResponse]) => {


            form.reset({
                name: menuDetailResponse?.name ?? "",

                description: menuDetailResponse?.description ?? "",
                code: menuDetailResponse?.code ?? "",
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
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={form.handleSubmit(handleSubmitForm)} heading={"Cập nhật menu"} >
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
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    required
                                    label="Tên"
                                    type="text"
                                    errorMessage={form.formState.errors.name?.message}
                                />
                            )}
                        />
                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    required
                                    label="Mã"
                                    type="text"
                                    errorMessage={form.formState.errors.code?.message}
                                />
                            )}
                        />
                    </div>

                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <TextArea
                                {...field}
                                label="Mô tả"
                                errorMessage={form.formState.errors.description?.message}
                            />
                        )}
                    />
                </div>
            </div>
        </ActionModal>
    )
}

export default UpdateCategoryModal