'use client'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useEffect, useState } from 'react'
import { DataTable } from './menu-data-table'
import { columns } from './menu-columns'
import { Menu } from '@/core/model/RBAC/Menu';
import MenuService from '@/core/service/RBAC/MenuService';
import ComponentCard from '@/components/common/ComponentCard'
import { Button } from '@/components/ui/shadcn/button'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import { SlidersHorizontal } from 'lucide-react'

function MenuPage() {
    let [data, setData] = useState<Menu[]>([])

    const { isOpen, openModal, closeModal } = useModal();
    useEffect(() => {
        MenuService.getAllMenus().then(e => setData(e))
    }, [])
    const handleAddMenu = () => {
        // Handle save logic here
        console.log("Saving changes...");
        closeModal();
    };
    let action = [
        <Button
            key="1"
            variant="outline"
            size="icon"
        >
            <SlidersHorizontal className="h-4 w-4" />
        </Button>]
    return (
        <div>
            <PageBreadcrumb pagePath='/menu' pageTitle="Menu" />
            <ComponentCard title="Danh sách Menu" >
                <DataTable columns={columns} data={data} actions={action} onAddClicked={openModal} onExportClicked={openModal} onSearch={(e) => {
                    console.log(e.target.value)
                }} currentPage={5} totalPage={10} onPageChange={function (page: number): void {
                    console.log(page);
                }} />
            </ComponentCard>
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[600px] p-5 lg:p-10"
            >
                <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                    Modal Heading
                </h4>
                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque euismod est quis mauris lacinia pharetra. Sed a ligula
                    ac odio condimentum aliquet a nec nulla. Aliquam bibendum ex sit
                    amet ipsum rutrum feugiat ultrices enim quam.
                </p>
                <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque euismod est quis mauris lacinia pharetra. Sed a ligula
                    ac odio.
                </p>
                <div className="flex items-center justify-end w-full gap-3 mt-8">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Close
                    </Button>
                    <Button size="sm" onClick={handleAddMenu}>
                        Save Changes
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default MenuPage