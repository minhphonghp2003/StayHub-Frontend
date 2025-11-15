import ComponentCard from '@/components/common/ComponentCard'
import List from '@/components/ui/list/list'
import TableFilterDrawer from '@/components/ui/table/table-filtering'
import { TableFitler } from '@/core/model/application/filter'
import { CategoryItem } from '@/core/model/catalog/category-item'
import { categoryItemService } from '@/core/service/catalog/category-item-service'
import React, { useEffect, useState } from 'react'

function MenuFilterDrawer({ isOpen, setOpenFilter, initFilter, onRemoveAllFilters, onFiltered }: { isOpen: boolean, setOpenFilter: any, initFilter?: TableFitler[], onFiltered: (filtered: TableFitler[]) => void, onRemoveAllFilters?: any }) {
    let [selectedGroupFilter, setSelectedGroupFilter] = useState<number | null>()
    let [menuGroups, setMenuGroups] = useState<CategoryItem[]>([])
    let onApply = (isApplied: boolean) => {
        if (isApplied) {
            onFiltered([
                {
                    code: "MENU",
                    id: selectedGroupFilter
                }
            ])
        } else {
            setSelectedGroupFilter(initFilter?.find(e => e.code == "MENU")?.id ?? null)
        }
        setOpenFilter(false)
    }
    useEffect(() => {
        setSelectedGroupFilter(initFilter?.find(e => e.code == "MENU")?.id ?? null)
        categoryItemService.getCategoryItemsByCategoryCode("MENU").then(e => setMenuGroups(e))
    }, [initFilter])


    return (
        <TableFilterDrawer isOpen={isOpen} onApply={onApply} onRemoveAllFilters={() => {
            setOpenFilter(false)
            onRemoveAllFilters()
        }} >
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <label className="text-md font-semibold mb-2 block ">Nhóm menu</label>
                <List items={menuGroups} selected={selectedGroupFilter} onClick={(e: any) => {
                    setSelectedGroupFilter(e.id)
                }} />
            </div>
        </TableFilterDrawer>
    )
}

export default MenuFilterDrawer