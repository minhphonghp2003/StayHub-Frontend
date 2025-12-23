import DynamicIcon from '@/components/common/DynamicIcon'
import Input from '@/components/form/InputField'
import { FormSelect } from '@/components/form/Select'
import TextArea from '@/components/form/TextArea'
import ActionModal from '@/components/ui/modal/ActionModal'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { Category } from '@/core/model/catalog/category'
import { CategoryItem } from '@/core/model/catalog/category-item'
import { UpdateCategoryPayload } from '@/core/payload/catalog/update-category-payload'
import { categoryItemService } from '@/core/service/catalog/category-item-service'
import { categoryService } from '@/core/service/catalog/category-service'
import menuService from '@/core/service/RBAC/menu-service'
import { toastPromise, showToast } from '@/lib/alert-helper'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
type FormValues = {
    name: string;
    code: string;
    description?: string;
};
function UpdateCategoryModal({ isOpen, closeModal, category, reload }: { isOpen: boolean, closeModal: any, category?: Category | null, reload: any }) {

    let [isLoading, setIsLoading] = useState(true)
    const form = useForm<FormValues>();

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
            showToast({ type: "error", content: "Có lỗi xảy ra" })
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
                        <Input {...form.register("name")} required label="Tên" type="text" />
                        <Input {...form.register("code")} required label="Đường dẫn" type="text" />
                    </div>

                    <TextArea {...form.register("description")} label="Mô tả" />
                </div>
            </div>
        </ActionModal>
    )
}

export default UpdateCategoryModal