"use client"
import Input from '@/components/form/InputField'
import PaginatedList from '@/components/ui/list/paginated-list'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { Menu } from '@/core/model/RBAC/Menu'
import menuService from '@/core/service/RBAC/menu-service'
import { Search } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function MenuList({ selectedMenu, onSelectMenu }: { selectedMenu: Menu | null, onSelectMenu: (menu: Menu | null) => void }) {
    let [menu, setMenu] = React.useState<Menu[]>([])
    let [loading, setLoading] = React.useState<boolean>(true)
    let [pageInfo, setPageInfo] = React.useState<PageInfo | null>(null)

    let fetchData = async ({ pageNumber, search }: { pageNumber: number, search?: string | null }) => {
        setLoading(true)
        let result = await menuService.getAllMenusCompact({
            search,
            pageNumber,
        })
        if (result) {
            setMenu(result.data)
            setPageInfo(result.pageInfo ?? null)
        }
        setLoading(false)
    }
    let onSearch = useDebouncedCallback((value) => {
        fetchData({ pageNumber: 1, search: value })
    }, 1000);
    useEffect(() => {
        fetchData({ pageNumber: 1, })
    }, [])
    return (
        <div className=''>
            <div className="col-span-4  rounded-2xl border border-slate-200  dark:border-gray-800 bg-white dark:bg-white/[0.03] flex flex-col overflow-hidden shadow-sm ">
                <div className="p-4 border-b dark:border-gray-800 border-slate-200">
                    <Input placeholder='Tìm kiếm' onChange={(e) => onSearch(e.target.value)} />
                </div>

                {
                    !loading && menu.length === 0 &&
                    <div className='flex flex-col items-center my-4'>
                        <Image color="red-100" className=" mx-auto" width={50} height={50} src={"/icons/box.png"} alt={""} />
                        <p >
                            Chưa có dữ liệu
                        </p>
                    </div>
                }
                <div className='relative flex-1 overflow-y-auto'>
                    {loading && (
                        <div className="absolute inset-0 z-50 bg-white/70 dark:bg-black/40 
                        flex items-center justify-center backdrop-blur-sm">
                            <Spinner className="size-8" />
                        </div>
                    )}
                    <PaginatedList items={menu.map(e => ({ id: e.id, name: e.name, desc: e.path }))} selectedId={selectedMenu?.id} onClick={(e: any) => {
                        onSelectMenu && onSelectMenu(menu.find(m => m.id === e.id)!)
                    }} pageInfo={pageInfo} onPageChanged={(page: number) => {
                        fetchData({ pageNumber: page })
                    }} />

                </div>
            </div>
        </div>
    )
}

export default MenuList