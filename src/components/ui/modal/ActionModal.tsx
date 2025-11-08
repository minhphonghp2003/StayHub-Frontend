"use client"
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useEffect, useState } from 'react'
import { Menu } from '@/core/model/RBAC/Menu';
import MenuService from '@/core/service/RBAC/menu-service';
import ComponentCard from '@/components/common/ComponentCard'
import { Button } from '@/components/ui/shadcn/button'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import { SlidersHorizontal } from 'lucide-react'
function ActionModal({ isOpen, closeModal, onConfirm, children, heading, closeOnEsc = false, closeOnOutsideClick = false, isFullscreen = false, size = "lg" }: any) {

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            closeOnEsc={closeOnEsc}
            closeOnOutsideClick={closeOnOutsideClick}
            isFullscreen={isFullscreen}
            size={size}
            className=" p-5 lg:p-10"
        >
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                {heading}
            </h4>
            {children}
            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button size="lg" variant="outline" onClick={closeModal}>
                    Đóng
                </Button>
                <Button size="lg" onClick={onConfirm}>
                    Xác nhận
                </Button>
            </div>
        </Modal>
    )
}

export default ActionModal