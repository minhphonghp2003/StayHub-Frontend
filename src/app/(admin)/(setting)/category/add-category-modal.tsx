import DynamicIcon from '@/components/common/DynamicIcon';
import Input from '@/components/form/InputField';
import { FormSelect } from '@/components/form/Select';
import TextArea from '@/components/form/TextArea';
import ActionModal from '@/components/ui/modal/ActionModal';
import { Spinner } from '@/components/ui/shadcn/spinner';
import { AddCategoryPayload } from '@/core/payload/catalog/add-category-payload';
import { AddMenuPayload } from '@/core/payload/RBAC/add-menu-payload';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import { categoryService } from '@/core/service/catalog/category-service';
import menuService from '@/core/service/RBAC/menu-service';
import { toastPromise, showToast } from '@/lib/alert-helper';
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';

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
            showToast({ type: "error", content: "Có lỗi xảy ra" });
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
                    <Input {...form.register("name")} required label="Tên" />
                    <Input {...form.register("code")} required label="Mã" />
                </div>

                <TextArea {...form.register("description")} label="Mô tả" />
            </div>
        </ActionModal>
    );
}

export default AddCategoryModal