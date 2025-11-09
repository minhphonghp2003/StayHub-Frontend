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
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
// TODO CRUD menu; create Filter component, 
function MenuItem() {
    // ---------------query param------------
    const router = useRouter();
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const page = searchParams.get('page')
    const menuGroup = searchParams.get('group')
    // -------------- component sate-----
    let [loading, setLoading] = useState(true)
    let [menuData, setMenuData] = useState<Menu[]>([])
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
    const [filter, setFilter] = useState<TableFitler[]>()
    // --------modal/drawer state-----------------
    const [openFilter, setOpenFilter] = React.useState(false)
    const { isOpen: isOpenAdd, openModal: openAddModal, closeModal: closeAddModal } = useModal();
    const { isOpen: isOpenUpdate, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();
    // ----------------------------------------------

    useEffect(() => {
        setFilter([
            {
                code: "MENU",
                id: menuGroup && parseInt(menuGroup)
            }
        ])
        setLoading(true)
        setMenuData([])
        MenuService.getAllMenus({ pageNumber: page, search, menuGroupId: menuGroup }).then(e => {
            setMenuData(e?.data ?? []); setLoading(false); setPageInfo(e?.pageInfo ?? null);
        })
    }, [page, search, menuGroup])
    let onChangePage = useDebouncedCallback((page) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('page', page.toString());
        router.push(`?${currentParams.toString()}`);
    }, 500);
    let onSearch = useDebouncedCallback((value) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('search', value);
        router.push(`?${currentParams.toString()}`);
    }, 1000);
    let onFilter = (filtered: TableFitler[]) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        filtered.forEach(e => {
            if (e.code == "MENU" && e.id) {
                currentParams.set('group', e.id.toString());
            }
        });
        router.push(`?${currentParams.toString()}`);
    }
    let onRemoveAllFilter = () => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.delete('group');
        router.push(`?${currentParams.toString()}`);
    }

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
            <DataTable search={search} onFilterClicked={() => setOpenFilter(true)} columns={columns} data={menuData} onAddClicked={openAddModal} onExportClicked={openAddModal} onSearch={onSearch} currentPage={pageInfo?.currentPage ?? 1} totalPage={pageInfo?.totalPages ?? 1} totalItems={pageInfo?.totalCount ?? 0} onPageChange={onChangePage} name="Danh sách Menu" loading={loading} pageSize={pageInfo?.pageSize ?? 0} />
            <AddMenuModal isOpen={isOpenAdd} closeModal={closeAddModal} />
            <UpdateMenuModal isOpen={isOpenUpdate} closeModal={closeUpdateModal} />
            <MenuFilterDrawer isOpen={openFilter} setOpenFilter={setOpenFilter} initFilter={filter} onFiltered={onFilter} onRemoveAllFilters={onRemoveAllFilter}></MenuFilterDrawer>

        </div>
    )
}

export default MenuItem