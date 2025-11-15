import DynamicIcon from '@/components/common/DynamicIcon';
import Input from '@/components/form/InputField';
import CustomSelect from '@/components/form/Select';
import TextArea from '@/components/form/TextArea';
import ActionModal from '@/components/ui/modal/ActionModal';
import { CategoryItem } from '@/core/model/catalog/category-item';
import { Menu } from '@/core/model/RBAC/Menu';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import menuService from '@/core/service/RBAC/menu-service';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
    name: string;
    path: string;
    icon?: string;
    groupId?: number;
    parentId?: number;
    description?: string;
};
function UpdateMenuModal({ isOpen, closeModal, menu }: { isOpen: boolean, closeModal: any, menu?: Menu | null }) {
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

    const handleSubmitForm: SubmitHandler<FormValues> = async (data,) => {
        // Convert optional number fields to number or undefined
        // const payload: AddMenuPayload = {
        //     name: data.name,
        //     path: data.path,
        //     icon: data.icon || undefined,
        //     groupId: data.groupId ? Number(data.groupId) : undefined,
        //     parentId: data.parentId ? Number(data.parentId) : undefined,
        //     description: data.description || undefined,
        // };

        // const data = form.getValues();
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
            setMenuGroup(menuGroupResponse)

            form.reset({
                name: menuDetailResponse?.name ?? "",
                path: menuDetailResponse?.path ?? "",
                icon: menuDetailResponse?.icon ?? "",
                description: menuDetailResponse?.description ?? "",
                groupId: menuDetailResponse?.groupId ?? 0,
                parentId: menuDetailResponse?.parentId ?? undefined,
            });
        });

        return () => {
            setIcon("");
            form.reset()
        };
    }, [isOpen])

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={() => { form.handleSubmit(handleSubmitForm) }} heading={"Cập nhật menu"} >
            <div className='flex flex-col gap-4'>
                <div className='flex gap-2  justify-between items-center'>
                    <Input  {...form.register("name")} required label='Tên' type="text" />
                    <Input  {...form.register("path")} required label='Đường dẫn' type="text" />
                </div>
                <Input  {...form.register("icon")} onChange={(e) => {
                    setIcon(e.target.value);
                }} suffix={<DynamicIcon iconString={icon} className="text-gray-500" />} label='Icon' type="text" />
                <div className='flex gap-2 '>
                    <CustomSelect defaultValue={form.getValues().groupId}  {...form.register("groupId")} required label='Nhóm menu' options={menuGroups.map(e => ({ value: e.id ?? 0, label: e.name }))} />
                    <CustomSelect defaultValue={form.getValues().parentId} {...form.register("parentId")} label='Thuộc Menu' options={parentMenus.map(e => ({ value: e.id ?? 0, label: e.name }))} />
                </div>
                <TextArea {...form.register("description")} label='Mô tả' />
            </div>
        </ActionModal>
    )
}

export default UpdateMenuModal

