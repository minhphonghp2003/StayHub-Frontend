import DefaultInputs from '@/components/form/form-elements/DefaultInputs';
import DropzoneComponent from '@/components/form/form-elements/DropZone';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import ActionModal from '@/components/ui/modal/ActionModal'
import { CategoryItem } from '@/core/model/catalog/category-item';
import { Menu } from '@/core/model/RBAC/Menu';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import menuService from '@/core/service/RBAC/menu-service';
import { ChevronDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone';

function AddMenuModal({ isOpen, closeModal }: { isOpen: boolean, closeModal: any }) {
    let [menuGroups, setMenuGroup] = useState<CategoryItem[]>([])
    let [parentMenus, setParentMenus] = useState<CategoryItem[]>([])
    const handleAddMenu = () => {
        console.log("Saving changes...");
        closeModal();
    };
    useEffect(() => {
        if (isOpen) {
            menuService.getAllNoPaginateMenus().then(function (e) {
                return setParentMenus(e);
            })
            categoryItemService.getCategoryItemsByCategoryCode("MENU").then(e => setMenuGroup(e))
        }

    }, [isOpen])

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={handleAddMenu} heading={"Thêm mới menu"} >
            <div>
                <Label>Input</Label>
                {parentMenus.length}
                <Input type="text" />
                <Label>Path</Label>
                {menuGroups.length}
                <Input type="text" />

            </div>
        </ActionModal>
    )
}

export default AddMenuModal