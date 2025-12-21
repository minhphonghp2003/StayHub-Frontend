'use client'
import AddMenuModal from '@/app/(admin)/(RBAC)/menu/menu-items/add-menu-modal';
import { getMenuColumns } from '@/app/(admin)/(RBAC)/menu/menu-items/menu-columns';
import MenuDeleteDialog from '@/app/(admin)/(RBAC)/menu/menu-items/menu-delete-dialog';
import MenuFilterDrawer from '@/app/(admin)/(RBAC)/menu/menu-items/menu-filter';
import UpdateMenuModal from '@/app/(admin)/(RBAC)/menu/menu-items/update-menu-modal';
import Switch from '@/components/form/Switch';
import Badge from '@/components/ui/badge/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/shadcn/dropdown-menu";
import { DataTable } from '@/components/ui/table/data-table';
import { TableFitler } from '@/core/model/application/filter';
import { Menu } from '@/core/model/RBAC/Menu';
import menuService from '@/core/service/RBAC/menu-service';
import MenuService from '@/core/service/RBAC/menu-service';
import { useModal } from '@/hooks/useModal';
import { toastPromise } from '@/lib/alert-helper';
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
type ModalState = {
    type: 'ADD' | 'UPDATE' | 'DELETE' | null;
    data: Menu | null;
}
//  TODO fix init form
function MenuItem() {
    // ---------------query param------------
    const router = useRouter();
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const page = searchParams.get('page')
    const menuGroup = searchParams.get('group')
    // -------------- component sate-----
    let [modal, setModalState] = useState<ModalState>({ type: null, data: null });
    let [loading, setLoading] = useState(true)
    let [menuData, setMenuData] = useState<Menu[]>([])
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
    const [filter, setFilter] = useState<TableFitler[]>()
    const [openFilter, setOpenFilter] = React.useState(false)

    useEffect(() => {
        setFilter([
            {
                code: "MENU",
                id: menuGroup && parseInt(menuGroup)
            }
        ])
        fetchData()
    }, [page, search, menuGroup])
    // ---------------functions-----------------
    let closeModal = () => {
        setModalState({ type: null, data: null });
    }
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
    let onToggleActive = async (menu: Menu, value: boolean) => {
        const result = await toastPromise(menuService.setActivateMenu(menu.id ?? 0, value),
            {
                loading: "Đang cập nhật trạng thái...",
                success: "Cập nhật trạng thái thành công!",
                error: "Cập nhật trạng thái thất bại!",
            })
        setMenuData(prev =>
            prev.map(item =>
                item.id === menu.id
                    ? { ...item, isActive: value, }
                    : item
            )
        );
    }
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
    const columns = getMenuColumns({ onDelete: (menu) => setModalState({ type: 'DELETE', data: menu }), onUpdate: (menu) => setModalState({ type: 'UPDATE', data: menu }), onToggleActive });
    return (
        <div>
            <DataTable search={search} onFilterClicked={() => setOpenFilter(true)} columns={columns} data={menuData} onAddClicked={() => setModalState({ type: 'ADD', data: null })} onSearch={onSearch} currentPage={pageInfo?.currentPage ?? 1} totalPage={pageInfo?.totalPages ?? 1} totalItems={pageInfo?.totalCount ?? 0} onPageChange={onChangePage} name="Danh sách Menu" loading={loading} pageSize={pageInfo?.pageSize ?? 0} />
            <AddMenuModal isOpen={modal.type === 'ADD'} closeModal={closeModal} reload={fetchData} />
            <UpdateMenuModal isOpen={modal.type === 'UPDATE' && modal.data !== null} closeModal={closeModal} menu={modal.data} reload={fetchData} />
            <MenuDeleteDialog isOpen={modal.type === 'DELETE' && modal.data !== null} closeModal={closeModal} menu={modal.data} reload={fetchData} />
            <MenuFilterDrawer isOpen={openFilter} setOpenFilter={setOpenFilter} initFilter={filter} onFiltered={onFilter} onRemoveAllFilters={onRemoveAllFilter}></MenuFilterDrawer>
        </div>
    )
}

export default MenuItem