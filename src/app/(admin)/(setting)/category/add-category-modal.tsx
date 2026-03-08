import Input from '@/components/form/InputField';
import TextArea from '@/components/form/TextArea';
import ActionModal from '@/components/ui/modal/ActionModal';
import { AddCategoryPayload } from '@/core/payload/catalog/add-category-payload';
import { categoryService } from '@/core/service/catalog/category-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
    name: string;
    code: string;
    description?: string;
};
function AddCategoryModal({
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

    const handleAddCategory: SubmitHandler<FormValues> = async (data) => {
        const payload: AddCategoryPayload = {
            name: data.name,
            description: data.description || undefined,
            code: data.code,
        };

        try {
            const result = await toastPromise(
                categoryService.createCategory(payload),
                {
                    loading: "Đang tạo category...",
                    success: "Tạo category thành công!",
                    error: "Tạo category thất bại!",
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
    let fetchData = async () => {
    };

    useEffect(() => {
        if (!isOpen) return;
        fetchData();
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
            onConfirm={form.handleSubmit(handleAddCategory)}
            heading="Thêm mới category"
        >
            <div className="flex flex-col gap-4">

                <div className="flex gap-2">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                required
                                label="Tên"
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
        </ActionModal>
    );
}

export default AddCategoryModal