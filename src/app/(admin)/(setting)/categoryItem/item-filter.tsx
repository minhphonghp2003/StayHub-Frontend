import List from '@/components/ui/list/list'
import PaginatedList from '@/components/ui/list/paginated-list'
import TableFilterDrawer from '@/components/ui/table/table-filtering'
import { TableFitler } from '@/core/model/application/filter'
import { Category } from '@/core/model/catalog/category'
import { categoryService } from '@/core/service/catalog/category-service'
import React, { useEffect, useState } from 'react'

function ItemFilter({ isOpen, setOpenFilter, initFilter, onRemoveAllFilters, onFiltered }: { isOpen: boolean, setOpenFilter: any, initFilter?: TableFitler[], onFiltered: (filtered: TableFitler[]) => void, onRemoveAllFilters?: any }) {
    // Selected
    let [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>()
    // Data
    let [category, setCategory] = useState<Category[]>([])
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
    // 
    let onApply = (isApplied: boolean) => {
        if (isApplied) {
            onFiltered([
                {
                    code: "CATEGORY",
                    id: selectedCategoryFilter
                }
            ])
        } else {
            setSelectedCategoryFilter(initFilter?.find(e => e.code == "CATEGORY")?.id ?? null)
        }
        setOpenFilter(false)
    }
    useEffect(() => {
        setSelectedCategoryFilter(initFilter?.find(e => e.code == "CATEGORY")?.id ?? null)
        categoryService.getAllCategories({ pageNumber: pageInfo?.currentPage ?? 1, pageSize: pageInfo?.pageSize ?? 8 }).then(e => {
            setCategory(e?.data ?? [])
            setPageInfo(e?.pageInfo ?? null)
        });
    }, [initFilter])


    return (
        <TableFilterDrawer isOpen={isOpen} onApply={onApply} onRemoveAllFilters={() => {
            setOpenFilter(false)
            onRemoveAllFilters()
        }} >
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <label className="text-md font-semibold mb-2 block ">Category</label>
                <PaginatedList items={category.map(e => ({ id: e.id, name: e.name, code: e.code }))} onClick={(e: any) => setSelectedCategoryFilter(e.id)} selected={selectedCategoryFilter} pageInfo={pageInfo} onPageChanged={(page: number) => {
                    categoryService.getAllCategories({ pageNumber: page, pageSize: pageInfo?.pageSize ?? 10 }).then(e => {
                        setCategory(e?.data ?? [])
                        setPageInfo(e?.pageInfo ?? null)
                    });
                }} />

            </div>
        </TableFilterDrawer>
    )
}

export default ItemFilter