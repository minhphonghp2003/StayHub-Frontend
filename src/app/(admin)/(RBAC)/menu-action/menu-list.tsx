"use client"
import Input from '@/components/form/InputField'
import PaginatedList from '@/components/ui/list/paginated-list'
import { Menu } from '@/core/model/RBAC/Menu'
import menuService from '@/core/service/RBAC/menu-service'
import { Search } from 'lucide-react'
import React, { useEffect } from 'react'

function MenuList({ selectedMenu, onSelectMenu }: { selectedMenu: Menu | null, onSelectMenu: (menu: Menu | null) => void }) {
    let [menu, setMenu] = React.useState<Menu[]>([])
    let [search, setSearch] = React.useState<string | null>(null)
    let [loading, setLoading] = React.useState<boolean>(true)
    let [pageInfo, setPageInfo] = React.useState<PageInfo | null>(null)

    let fetchData = async ({ pageNumber }: { pageNumber: number }) => {
        setLoading(true)
        let result = await menuService.getAllMenusCompact({
            search: search,
            pageNumber: pageNumber,
        })
        if (result) {
            setMenu(result.data)
            setPageInfo(result.pageInfo ?? null)
        }
    }
    useEffect(() => {
        fetchData({ pageNumber: 1 })
    }
        , [search])
    return (
        <div>
            <div className="col-span-4  bg-white rounded-2xl border border-slate-200  dark:border-gray-800 dark:bg-white/[0.03] flex flex-col overflow-hidden shadow-sm">
                <div className="p-4 border-b dark:border-gray-800 border-slate-200">
                    <Input placeholder='Tìm kiếm' />
                </div>
                <PaginatedList items={menu.map(e => ({ id: e.id, name: e.name, desc: e.path }))} selectedId={selectedMenu?.id} onClick={(e: any) => {
                    onSelectMenu && onSelectMenu(menu.find(m => m.id === e.id)!)
                }} pageInfo={pageInfo} onPageChanged={(page: number) => {
                    fetchData({ pageNumber: page })
                }} />

            </div>
        </div>
    )
}

export default MenuList