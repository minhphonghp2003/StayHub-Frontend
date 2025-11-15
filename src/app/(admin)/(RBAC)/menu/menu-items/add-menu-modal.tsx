import Input from '@/components/form/InputField';
import Label from '@/components/form/Label';
import ActionModal from '@/components/ui/modal/ActionModal'
import { CategoryItem } from '@/core/model/catalog/category-item';
import { Menu } from '@/core/model/RBAC/Menu';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import menuService from '@/core/service/RBAC/menu-service';
import { ArrowBigDown, ChevronDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone';
import CustomSelect from '@/components/form/Select';
import TextArea from '@/components/form/TextArea';
import DynamicIcon from '@/components/common/DynamicIcon';
import { AddMenuPayload } from '@/core/payload/RBAC/add-menu-payload';
import { showToast } from '@/lib/alert-helper';
import { parseOptionalNumber } from '@/lib/utils';

function AddMenuModal({ isOpen, closeModal, reload }: { isOpen: boolean, closeModal: any, reload?: any }) {
    let [menuGroups, setMenuGroup] = useState<CategoryItem[]>([])
    let [parentMenus, setParentMenus] = useState<CategoryItem[]>([])
    let [icon, setIcon] = useState<string>("")
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
        let result = await menuService.createMenu(payload)
        if (result) {
            showToast({ type: "success", content: "Tạo menu thành công" })
            closeModal()
            reload()
            return
        } else {
            showToast({ type: "error", content: result || "Tạo menu thất bại" })
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
            setIcon("")
        };
    }, [isOpen])

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={handleAddMenu} heading={"Thêm mới menu"} >
            <div className='flex flex-col gap-4'>
                <div className='flex gap-2  justify-between items-center'>
                    <Input required label='Tên' name='name' type="text" />
                    <Input required label='Đường dẫn' name='path' type="text" />
                </div>
                <Input onChange={(e) => {
                    setIcon(e.target.value);
                }} suffix={<DynamicIcon iconString={icon} className="text-gray-500" />} label='Icon' name='icon' type="text" />
                <div className='flex gap-2 '>
                    <CustomSelect required label='Nhóm menu' name='groupId' options={menuGroups.map(e => ({ value: e.id ?? 0, label: e.name }))} />
                    <CustomSelect label='Thuộc Menu' name='parentId' options={parentMenus.map(e => ({ value: e.id ?? 0, label: e.name }))} />
                </div>
                <TextArea label='Mô tả' name='description' />
            </div>
        </ActionModal>
    )
}

export default AddMenuModal