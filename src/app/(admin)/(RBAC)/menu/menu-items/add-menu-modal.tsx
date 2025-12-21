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
import { parseOptionalNumber } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

function AddMenuModal({ isOpen, closeModal, reload }: { isOpen: boolean, closeModal: any, reload?: any }) {
    let [menuGroups, setMenuGroup] = useState<CategoryItem[]>([])
    let [parentMenus, setParentMenus] = useState<CategoryItem[]>([])
    let [icon, setIcon] = useState<string>("")
    const form = useForm({
        defaultValues: {
            name: "",
            path: "",
            icon: "",
            groupId: 0,
            parentId: 0,
            description: ""
        },
    });
    const handleAddMenu = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        const payload: AddMenuPayload = {
            name: String(data.name || ""),
            path: String(data.path || ""),
            groupId: parseOptionalNumber(data.groupId) ?? 0,
            description: data.description ? String(data.description) : undefined,
            icon: data.icon ? String(data.icon) : undefined,
            parentId: parseOptionalNumber(data.parentId),
        };
        try {
            // Call API with toastPromise helper
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
                reload(); // refresh parent data
            }
        } catch (err) {
            showToast({ type: "error", content: "Có lỗi xảy ra" })
            // console.error(err);
        }


    };
    useEffect(() => {
        if (isOpen) {
            menuService.getAllNoPaginateMenus().then(function (e) {
                return setParentMenus(e);
            })
            categoryItemService.getCategoryItemsByCategoryCode("MENU").then(e => setMenuGroup(e))
        }
        return () => {
            setIcon("");
            form.reset({
                name: "",
                path: "",
                icon: "",
                groupId: 0,
                parentId: 0,
                description: "",
            })
        };
    }, [isOpen])

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={handleAddMenu} heading={"Thêm mới menu"} >
            <div className='flex flex-col gap-4'>
                <div className='flex gap-2  justify-between items-center'>
                    <Input {...form.register("name")} required label="Tên" type="text" />
                    <Input {...form.register("path")} required label="Đường dẫn" type="text" />
                </div>
                <Input
                    {...form.register("icon")}
                    onChange={(e) => setIcon(e.target.value)}
                    suffix={<DynamicIcon iconString={icon} className="text-gray-500" />}
                    label="Icon"
                    type="text"
                />
                <div className='flex gap-2 '>

                    <FormSelect
                        name="groupId"
                        control={form.control}
                        label="Nhóm menu"
                        required
                        options={menuGroups.map(g => ({
                            value: g.id?.toString(),
                            label: g.name,
                        }))}
                    />
                    <FormSelect
                        name="parentId"
                        control={form.control}
                        label="Thuộc Menu"
                        options={parentMenus.map(g => ({
                            value: g.id?.toString(),
                            label: g.name,
                        }))}
                    />
                </div>
                <TextArea label='Mô tả' name='description' />
            </div>
        </ActionModal>
    )
}

export default AddMenuModal