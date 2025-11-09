import ComponentCard from '@/components/common/ComponentCard'
import ListPage from '@/components/ui/list/paginate-list'
import TableFilterDrawer from '@/components/ui/table/table-filtering'
import { TableFitler } from '@/core/model/application/filter'
import { CategoryItem } from '@/core/model/catalog/category-item'
import { categoryItemService } from '@/core/service/catalog/category-item-service'
import React, { useEffect, useState } from 'react'

function MenuFilterDrawer({ isOpen, setOpenFilter, initFilter, onFiltered }: { isOpen: boolean, setOpenFilter: any, initFilter?: TableFitler[], onFiltered: (filtered: TableFitler[]) => void }) {
    let [groupFilter, setGroupFilter] = useState<number | null>()
    let [menuGroups, setMenuGroups] = useState<CategoryItem[]>([])
    let onApply = (isApplied: boolean) => {
        if (isApplied) {
            onFiltered([
                {
                    code: "MENU",
                    id: groupFilter
                }
            ])
        } else {
            setGroupFilter(initFilter?.find(e => e.code == "MENU")?.id ?? null)
        }
        setOpenFilter(false)
    }
    useEffect(() => {
        setGroupFilter(initFilter?.find(e => e.code == "MENU")?.id ?? null)
        categoryItemService.getCategoryItemsByCategoryCode("MENU").then(e => setMenuGroups(e))
    }, [initFilter])


    return (
        <TableFilterDrawer isOpen={isOpen} onApply={onApply} >
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <label className="text-md font-semibold mb-2 block ">Nhóm menu</label>
                <ListPage items={menuGroups} selected={groupFilter} onClick={(e: any) => {
                    setGroupFilter(e.id)
                }} />
            </div>
        </TableFilterDrawer>
    )
}

export default MenuFilterDrawer