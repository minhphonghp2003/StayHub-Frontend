import ComponentCard from '@/components/common/ComponentCard'
import ListPage from '@/components/ui/list/paginate-list'
import TableFilterDrawer from '@/components/ui/table/table-filtering'
import { TableFitler } from '@/core/model/application/filter'
import { CategoryItem } from '@/core/model/catalog/category-item'
import { categoryItemService } from '@/core/service/catalog/category-item-service'
import React, { useEffect, useState } from 'react'

function MenuFilterDrawer({ isOpen, setOpenFilter, initFilter, setInitFitler }: { isOpen: boolean, setOpenFilter: any, initFilter?: TableFitler[], setInitFitler: any }) {
    let [filter, setFilter] = useState<TableFitler[]>([])
    let [menuGroups, setMenuGroups] = useState<CategoryItem[]>([])
    let onApply = (isApplied: boolean) => {
        setOpenFilter(false)
        setInitFitler(filter)
    }
    useEffect(() => {
        categoryItemService.getCategoryItemsByCategoryCode("MENU").then(e => setMenuGroups(e))
    }, [])
    return (
        <TableFilterDrawer isOpen={isOpen} onApply={onApply} >
            <div className="flex-1 overflow-y-auto p-2 space-y-4">
                <ListPage />
            </div>
        </TableFilterDrawer>
    )
}

export default MenuFilterDrawer