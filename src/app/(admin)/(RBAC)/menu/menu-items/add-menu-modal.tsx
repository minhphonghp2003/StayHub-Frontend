import ActionModal from '@/components/ui/modal/ActionModal'
import React, { useEffect, useState } from 'react'

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
    return (
        <ActionModal isOpen={isOpen} closeModal={closeModal} onConfirm={handleAddMenu} heading={"Thêm mới menu"} >
            hihi
        </ActionModal>
    )
}

export default AddMenuModal