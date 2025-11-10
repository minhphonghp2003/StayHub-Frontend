import DefaultInputs from '@/components/form/form-elements/DefaultInputs';
import DropzoneComponent from '@/components/form/form-elements/DropZone';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import ActionModal from '@/components/ui/modal/ActionModal'
import { ChevronDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone';

function AddMenuModal({ isOpen, closeModal }: { isOpen: boolean, closeModal: any }) {
    const handleAddMenu = () => {
        console.log("Saving changes...");
        closeModal();
    };
    useEffect(() => {
        if (isOpen) {
            console.log("Add menu");
        }

    }, [isOpen])
    // string Name, string Path,int GroupId, string? Description, string? Icon, int? ParentId
    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={handleAddMenu} heading={"Thêm mới menu"} >
            <div>
                <Label>Input</Label>
                <Input type="text" />
                <Label>Path</Label>
                <Input type="text" />
               
            </div>
        </ActionModal>
    )
}

export default AddMenuModal