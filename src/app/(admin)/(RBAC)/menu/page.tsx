'use client'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useEffect, useState } from 'react'
import { DataTable } from '../../../../components/ui/table/data-table'
import { menuColumns } from './menu-columns'
import { Menu } from '@/core/model/RBAC/Menu';
import MenuService from '@/core/service/RBAC/menu-service';
import ComponentCard from '@/components/common/ComponentCard'
import { Button } from '@/components/ui/shadcn/button'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import { SlidersHorizontal } from 'lucide-react'
import ActionModal from '@/components/ui/modal/ActionModal'
import AddMenuModal from './add-menu-modal'

function MenuPage() {
    let [data, setData] = useState<Menu[]>([])

    const { isOpen: isOpenAdd, openModal: openAddModal, closeModal: closeAddModal } = useModal();
    useEffect(() => {
        MenuService.getAllMenus().then(e => setData(e))
    }, [])


    return (
        <div>
            <PageBreadcrumb pagePath='/menu' pageTitle="Menu" />

            <DataTable columns={menuColumns} data={data} onAddClicked={openAddModal} onSearch={(e) => {
                console.log(e.target.value)
            }} currentPage={5} totalPage={10} onPageChange={function (page: number): void {
                console.log(page)
            }} name="Danh sách Menu" />
            <AddMenuModal isOpen={isOpenAdd} closeModal={closeAddModal} />
        </div>
    )
}

export default MenuPage