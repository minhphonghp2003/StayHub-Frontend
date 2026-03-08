import DynamicIcon from '@/components/common/DynamicIcon'
import Input from '@/components/form/InputField'
import { FormSelect } from '@/components/form/Select'
import TextArea from '@/components/form/TextArea'
import ActionModal from '@/components/ui/modal/ActionModal'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { Category } from '@/core/model/catalog/category'
import { CategoryItem } from '@/core/model/catalog/category-item'
import { categoryItemService } from '@/core/service/catalog/category-item-service'
import { categoryService } from '@/core/service/catalog/category-service'
import { toastPromise } from '@/lib/alert-helper'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

function UpdateItemModal({ isOpen, closeModal, item, reload }: { isOpen: boolean, closeModal: any, item?: CategoryItem | null, reload: any }) {
    let [category, setCategory] = useState<Category[]>([])
    let [icon, setIcon] = useState<string>("")
    let [isLoading, setIsLoading] = useState(true)
    const form = useForm({
        mode: "onChange",
        resolver: async (values) => {
            const errors: any = {};

            if (!values.name?.trim()) {
                errors.name = { message: "Vui lòng nhập tên item" };
            }

            if (!values.code?.trim()) {
                errors.code = { message: "Vui lòng nhập mã item" };
            }

            if (!values.categoryId) {
                errors.categoryId = { message: "Vui lòng chọn danh mục" };
            }

            return {
                values,
                errors,
            };
        },
    });

    const handleSubmitForm: SubmitHandler<any> = async (data,) => {
        const payload = {
            name: data.name,
            icon: data.icon || undefined,
            code: data.code,
            value: data.value,
            categoryId: data.categoryId,
        };
        try {
            const result = await toastPromise(
                categoryItemService.updateCategoryItem(item?.id ?? 0, payload),
                {
                    loading: "Cập nhật item...",
                    success: "Cập nhật item thành công!",
                    error: "Cập nhật item thất bại!",
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
            categoryItemService.getCategoryItemById(item?.id ?? 0),
            categoryService.getAllFlatCategories()
        ]).then(([itemDetailResponse, categoryResponse]) => {

            setCategory(categoryResponse ?? [])
            setIcon(itemDetailResponse?.icon ?? "");
            form.reset({
                name: itemDetailResponse?.name ?? "",
                code: itemDetailResponse?.code ?? "",
                icon: itemDetailResponse?.icon ?? "",
                value: itemDetailResponse?.value ?? "",
                categoryId: itemDetailResponse?.categoryId?.toString(),
            });
            setIsLoading(false);
        });

        return () => {
            setIcon("");
            form.reset({
                name: "",
                icon: undefined,
                code: "",
                value: "",
                categoryId: "",
            })
        };
    }, [isOpen])

    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleSubmitForm)}
            heading="Cập nhật mới item"
        >
            <div className="flex flex-col gap-4">
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md transition-all duration-200">
                        <div className="flex flex-col items-center gap-2">
                            <Spinner className="size-14 text-brand-300" />
                            <span className="text-sm text-muted-foreground">Đang tải dữ liệu...</span>
                        </div>
                    </div>
                )}
                <div className="flex gap-2">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                required
                                label="Tên"
                                errorMessage={form.formState.errors.name?.message as string}
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
                                errorMessage={form.formState.errors.code?.message as string}
                            />
                        )}
                    />
                </div>

                <div className="flex gap-2" >
                    <Controller
                        name="icon"
                        control={form.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                label="Icon"
                                onChange={(e) => {
                                    field.onChange(e);
                                    setIcon(e.target.value);
                                }}
                                suffix={<DynamicIcon iconString={icon} className="text-gray-500" />}
                                errorMessage={form.formState.errors.icon?.message as string}
                            />
                        )}
                    />
                    {
                        !isLoading && category.length > 1 && <FormSelect
                            name="categoryId"
                            control={form.control}
                            label="Danh mục"
                            required
                            options={category.map((g) => ({
                                value: g.id?.toString() ?? 0,
                                label: g.name ?? "",
                            }))}
                            error={form.formState.errors.categoryId?.message as string}
                        />
                    }
                </div>
                <Controller
                    name="value"
                    control={form.control}
                    render={({ field }) => (
                        <TextArea
                            {...field}
                            label="Giá trị"
                            errorMessage={form.formState.errors.value?.message as string}
                        />
                    )}
                />
            </div>
        </ActionModal>
    )
}

export default UpdateItemModal