import DynamicIcon from '@/components/common/DynamicIcon';
import Input from '@/components/form/InputField';
import { FormSelect } from '@/components/form/Select';
import TextArea from '@/components/form/TextArea';
import ActionModal from '@/components/ui/modal/ActionModal';
import { Spinner } from '@/components/ui/shadcn/spinner';
import { Category } from '@/core/model/catalog/category';
import { AddCategoryItemPayload } from '@/core/payload/catalog/add-category-item-payload';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import { categoryService } from '@/core/service/catalog/category-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';


function AddItemModal({
    isOpen,
    closeModal,
    reload,
    categoryId,
}: {
    isOpen: boolean;
    closeModal: any;
    reload?: any;
    categoryId?: number;
}) {
    const [category, setCategory] = useState<Category[]>([]);
    let [isLoading, setIsLoading] = useState(true)
    const [icon, setIcon] = useState<string>("");
    const form = useForm<AddCategoryItemPayload>({
        defaultValues: {
            name: "",
            code: "",
            value: "",
            icon: "",
            categoryId: categoryId,
        },
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

    const handleAddCategoryItem: SubmitHandler<AddCategoryItemPayload> = async (data) => {
        const payload: AddCategoryItemPayload = {
            name: data.name,
            icon: data.icon || undefined,
            code: data.code,
            value: data.value,
            categoryId: data.categoryId,
        };

        try {
            const result = await toastPromise(
                categoryItemService.createCategoryItem(payload),
                {
                    loading: "Đang tạo item...",
                    success: "Tạo item thành công!",
                    error: "Tạo item thất bại!",
                }
            );

            if (result) {
                closeModal();
                reload?.();
                form.reset();
                setIcon("");
            }
        } catch {
            // error already displayed by toastPromise
        }
    };
    let fetchData = async () => {
        setIsLoading(true);
        await Promise.all([
            categoryService.getAllFlatCategories().then(setCategory),
        ]);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!isOpen) return;
        fetchData();
        return () => {
            setIcon("");
            form.reset({
                name: "",
                code: "",
                value: "",
                icon: "",
                categoryId: categoryId,
            });
        };
    }, [isOpen]);
    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleAddCategoryItem)}
            heading="Thêm mới item"
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
                                errorMessage={form.formState.errors.icon?.message}
                            />
                        )}
                    />
                    {
                        category.length > 0 && <FormSelect
                            name="categoryId"
                            control={form.control}
                            label="Danh mục"
                            required
                            options={category.map((g) => ({
                                value: g.id?.toString() ?? 0,
                                label: g.name ?? "",
                            }))}
                            error={form.formState.errors.categoryId?.message}
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
                            errorMessage={form.formState.errors.value?.message}
                        />
                    )}
                />
            </div>
        </ActionModal>
    )
}

export default AddItemModal