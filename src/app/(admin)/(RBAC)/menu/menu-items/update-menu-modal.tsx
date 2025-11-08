import ActionModal from '@/components/ui/modal/ActionModal'
import React, { useState } from 'react'

function UpdateMenuModal({ isOpen, closeModal }: { isOpen: boolean, closeModal: any }) {
    const handleAddMenu = () => {
        console.log("Saving changes...");
        closeModal();
    };
    return (
        <ActionModal isOpen={isOpen} closeModal={closeModal} onConfirm={handleAddMenu} heading={"Cập nhật menu"} >
            hihi
        </ActionModal>
    )
}

export default UpdateMenuModal