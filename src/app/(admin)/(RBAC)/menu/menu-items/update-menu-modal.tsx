import DynamicIcon from '@/components/common/DynamicIcon';
import Input from '@/components/form/InputField';
import CustomSelect from '@/components/form/Select';
import TextArea from '@/components/form/TextArea';
import ActionModal from '@/components/ui/modal/ActionModal'
import { CategoryItem } from '@/core/model/catalog/category-item';
import { Menu } from '@/core/model/RBAC/Menu';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import menuService from '@/core/service/RBAC/menu-service';
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"

function UpdateMenuModal({ isOpen, closeModal, menu }: { isOpen: boolean, closeModal: any, menu?: Menu | null }) {
    let [menuGroups, setMenuGroup] = useState<CategoryItem[]>([])
    let [parentMenus, setParentMenus] = useState<CategoryItem[]>([])
    let [icon, setIcon] = useState<string>("")
    const form = useForm({
        defaultValues: {
            name: menu?.name || "",
            path: menu?.path || "",
            icon: menu?.icon || "",
            groupId: menu?.groupId || 0,
            parentId: menu?.parentId || undefined,
            description: menu?.description || undefined
        },
    });
    const handleAddMenu = () => {
        console.log("Saving changes...");
        const data = form.getValues();
        console.log(data);
        // closeModal();
        // form.reset()
    };
    useEffect(() => {
        if (!isOpen) return;

        Promise.all([
            menuService.getMenuById(menu?.id ?? 0),
            menuService.getAllNoPaginateMenus(),
            categoryItemService.getCategoryItemsByCategoryCode("MENU")
        ]).then(([menuDetailResponse, parentMenusResponse, menuGroupResponse]) => {

            setParentMenus(parentMenusResponse);
            setMenuGroup(menuGroupResponse);


            form.reset({
                name: menuDetailResponse?.name ?? "",
                path: menuDetailResponse?.path ?? "",
                icon: menuDetailResponse?.icon ?? "",
                description: menuDetailResponse?.description ?? "",
                groupId: menuDetailResponse?.groupId ?? 0,
                parentId: menuDetailResponse?.parentId ?? 0,
            });
            console.log(form.getValues());

        });

        return () => {
            setIcon("");
            form.reset()
        };
    }, [isOpen])

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={() => { form.handleSubmit(handleAddMenu) }} heading={"Cập nhật menu"} >
            <div className='flex flex-col gap-4'>
                <div className='flex gap-2  justify-between items-center'>
                    <Input  {...form.register("name")} required label='Tên' name='name' type="text" />
                    <Input  {...form.register("path")} required label='Đường dẫn' name='path' type="text" />
                </div>
                <Input  {...form.register("icon")} onChange={(e) => {
                    setIcon(e.target.value);
                }} suffix={<DynamicIcon iconString={icon} className="text-gray-500" />} label='Icon' name='icon' type="text" />
                <div className='flex gap-2 '>
                    <CustomSelect {...form.register("groupId")} required label='Nhóm menu' name='groupId' options={menuGroups.map(e => ({ value: e.id ?? 0, label: e.name }))} />
                    <CustomSelect {...form.register("parentId")} label='Thuộc Menu' name='parentId' options={parentMenus.map(e => ({ value: e.id ?? 0, label: e.name }))} />
                </div>
                <TextArea {...form.register("description")} label='Mô tả' name='description' />
            </div>
        </ActionModal>
    )
}

export default UpdateMenuModal

