import DynamicIcon from '@/components/common/DynamicIcon';
import Input from '@/components/form/InputField';
import { FormSelect } from '@/components/form/Select';
import TextArea from '@/components/form/TextArea';
import ActionModal from '@/components/ui/modal/ActionModal';
import { CategoryItem } from '@/core/model/catalog/category-item';
import { AddMenuPayload } from '@/core/payload/RBAC/add-menu-payload';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import menuService from '@/core/service/RBAC/menu-service';
import { showToast, toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
    name: string;
    path: string;
    icon?: string;
    groupId?: string;
    parentId?: string;
    description?: string;
};

function AddMenuModal({
    isOpen,
    closeModal,
    reload,
}: {
    isOpen: boolean;
    closeModal: any;
    reload?: any;
}) {
    const [menuGroups, setMenuGroup] = useState<CategoryItem[]>([]);
    const [parentMenus, setParentMenus] = useState<CategoryItem[]>([]);
    const [icon, setIcon] = useState<string>("");

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            path: "",
            icon: "",
            groupId: undefined,
            parentId: undefined,
            description: "",
        },
    });

    const handleAddMenu: SubmitHandler<FormValues> = async (data) => {
        const payload: AddMenuPayload = {
            name: data.name,
            path: data.path,
            icon: data.icon || undefined,
            description: data.description || undefined,
            groupId: data.groupId ? Number(data.groupId) : 0,
            parentId: data.parentId ? Number(data.parentId) : undefined,
        };

        try {
            const result = await toastPromise(
                menuService.createMenu(payload),
                {
                    loading: "Đang tạo menu...",
                    success: "Tạo menu thành công!",
                    error: "Tạo menu thất bại!",
                }
            );

            if (result) {
                closeModal();
                reload?.();
                form.reset();
                setIcon("");
            }
        } catch {
            showToast({ type: "error", content: "Có lỗi xảy ra" });
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        menuService.getAllNoPaginateMenus().then(setParentMenus);
        categoryItemService
            .getCategoryItemsByCategoryCode("MENU")
            .then(setMenuGroup);

        return () => {
            setIcon("");
            form.reset({
                name: "",
                path: "",
                icon: "",
                description: "",
                groupId: undefined,
                parentId: undefined,
            });
        };
    }, [isOpen]);

    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={form.handleSubmit(handleAddMenu)}
            heading="Thêm mới menu"
        >
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input {...form.register("name")} required label="Tên" />
                    <Input {...form.register("path")} required label="Đường dẫn" />
                </div>

                <Input
                    {...form.register("icon")}
                    label="Icon"
                    onChange={(e) => setIcon(e.target.value)}
                    suffix={<DynamicIcon iconString={icon} className="text-gray-500" />}
                />

                <div className="flex gap-2">
                    <FormSelect
                        name="groupId"
                        control={form.control}
                        label="Nhóm menu"
                        required
                        options={menuGroups.map((g) => ({
                            value: g.id?.toString(),
                            label: g.name,
                        }))}
                    />

                    <FormSelect
                        name="parentId"
                        control={form.control}
                        label="Thuộc Menu"
                        options={parentMenus.map((g) => ({
                            value: g.id?.toString(),
                            label: g.name,
                        }))}
                    />
                </div>

                <TextArea {...form.register("description")} label="Mô tả" />
            </div>
        </ActionModal>
    );
}

export default AddMenuModal;
