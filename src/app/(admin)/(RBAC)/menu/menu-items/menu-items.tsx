'use client'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useEffect, useState } from 'react'
import { Menu } from '@/core/model/RBAC/Menu';
import MenuService from '@/core/service/RBAC/menu-service';
import { Button } from '@/components/ui/shadcn/button'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import { Edit2, MoreHorizontal, RefreshCcw, SlidersHorizontal, Trash2 } from 'lucide-react'
import ActionModal from '@/components/ui/modal/ActionModal'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog"
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
import MenuDeleteDialog from '@/app/(admin)/(RBAC)/menu/menu-items/menu-delete-dialog';
import { SelectItem } from '@radix-ui/react-select';
// TODO CRUD menu 
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
    const [selected, setSelected] = useState<Menu | null>(null)
    // --------modal/drawer state-----------------
    const [openFilter, setOpenFilter] = React.useState(false)
    const { isOpen: isOpenAdd, openModal: openAddModal, closeModal: closeAddModal } = useModal();
    const { isOpen: isOpenUpdate, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();
    const { isOpen: isOpenDelete, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
    // ----------------------------------------------

    useEffect(() => {
        setFilter([
            {
                code: "MENU",
                id: menuGroup && parseInt(menuGroup)
            }
        ])
        fetchData()
    }, [page, search, menuGroup])
    let fetchData = async () => {
        setLoading(true)
        setMenuData([])
        let result = await MenuService.getAllMenus({ pageNumber: page, search, menuGroupId: menuGroup })
        setMenuData(result?.data ?? []);
        setPageInfo(result?.pageInfo ?? null);
        setLoading(false);
    }
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
                    const menu = row.original
                    return (
                        <div className='flex justify-center'>
                            <DropdownMenu >
                                <DropdownMenuTrigger asChild>
                                    <MoreHorizontal className="h-4 w-4  " />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={openUpdateModal}>
                                        <Edit2 className="mr-2 w-4 h-4 opacity-70 text-blue-500" />
                                        <span className='text-blue-500'>
                                            Cập nhật
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setSelected(menu); openDeleteModal() }}>
                                        <Trash2 className="mr-2 w-4 h-4 opacity-70 text-red-500" />
                                        <span className='text-red-500'>Xóa</span>
                                    </DropdownMenuItem>

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
            <AddMenuModal isOpen={isOpenAdd} closeModal={closeAddModal} reload={fetchData} />
            <UpdateMenuModal isOpen={isOpenUpdate} closeModal={closeUpdateModal} />
            <MenuFilterDrawer isOpen={openFilter} setOpenFilter={setOpenFilter} initFilter={filter} onFiltered={onFilter} onRemoveAllFilters={onRemoveAllFilter}></MenuFilterDrawer>
            <MenuDeleteDialog isOpen={isOpenDelete} closeModal={closeDeleteModal} reload={fetchData} menu={selected} />
        </div>
    )
}

export default MenuItem