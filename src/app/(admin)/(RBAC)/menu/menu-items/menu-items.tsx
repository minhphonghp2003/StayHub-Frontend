'use client'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useEffect, useState } from 'react'
import { Menu } from '@/core/model/RBAC/Menu';
import MenuService from '@/core/service/RBAC/menu-service';
import ComponentCard from '@/components/common/ComponentCard'
import { Button } from '@/components/ui/shadcn/button'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import { MoreHorizontal, SlidersHorizontal } from 'lucide-react'
import ActionModal from '@/components/ui/modal/ActionModal'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu"
import AddMenuModal from '@/app/(admin)/(RBAC)/menu/menu-items/add-menu-modal';
import { menuColumns } from '@/app/(admin)/(RBAC)/menu/menu-items/menu-columns';
import UpdateMenuModal from '@/app/(admin)/(RBAC)/menu/menu-items/update-menu-modal';
import { DataTable } from '@/components/ui/table/data-table';
import TableFilterDrawer from '@/components/ui/table/table-filtering';
import { TableFitler } from '@/core/model/application/filter';
import MenuFilterDrawer from '@/app/(admin)/(RBAC)/menu/menu-items/menu-filter';
function MenuItem() {
    let [loading, setLoading] = useState(true)
    let [menuData, setMenuData] = useState<Menu[]>([])
    const [openFilter, setOpenFilter] = React.useState(false)
    const [filter, setFilter] = useState<TableFitler[]>([])
    const { isOpen: isOpenAdd, openModal: openAddModal, closeModal: closeAddModal } = useModal();
    const { isOpen: isOpenUpdate, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();
    useEffect(() => {
        setLoading(true)
        MenuService.getAllMenus().then(e => { setMenuData(e); setLoading(false) })
    }, [])
    let onChangePage = (page: number) => { }
    let onSearch = (e: any) => { }
    let onRemoveFilter = (filter: TableFitler) => { }

    const columns = menuColumns.map((col) => {
        if (col.id === "actions") {
            return {
                ...col,
                cell: ({ row }: any) => {
                    const menu = row.origina
                    return (
                        <div className='flex justify-center'>
                            <DropdownMenu >
                                <DropdownMenuTrigger asChild>
                                    <MoreHorizontal className="h-4 w-4  " />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => navigator.clipboard.writeText(menu.id?.toString() ?? "null")}
                                    >
                                        Copy payment ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={openUpdateModal}>View customer</DropdownMenuItem>
                                    <DropdownMenuItem>View payment details</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },

            };
        }
        return col;
    });
    return (
        <div>
            <DataTable filters={filter} onRemoveFilter={onRemoveFilter} onFilterClicked={() => setOpenFilter(true)} columns={columns} data={menuData} onAddClicked={openAddModal} onExportClicked={openAddModal} onSearch={onSearch} currentPage={5} totalPage={10} onPageChange={onChangePage} name="Danh sách Menu" totalItems={0} loading={loading} />
            <AddMenuModal isOpen={isOpenAdd} closeModal={closeAddModal} />
            <UpdateMenuModal isOpen={isOpenUpdate} closeModal={closeUpdateModal} />
            <MenuFilterDrawer openFilter={openFilter} setOpenFilter={setOpenFilter}></MenuFilterDrawer>

        </div>
    )
}

export default MenuItem