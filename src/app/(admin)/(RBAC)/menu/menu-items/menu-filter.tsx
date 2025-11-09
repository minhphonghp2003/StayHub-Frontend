import TableFilterDrawer from '@/components/ui/table/table-filtering'
import { TableFitler } from '@/core/model/application/filter'
import React, { useState } from 'react'

function MenuFilterDrawer({ isOpen, setOpenFilter, initFilter, setInitFitler }: { isOpen: boolean, setOpenFilter: any, initFilter?: TableFitler[], setInitFitler: any }) {
    let [filter, setFilter] = useState<TableFitler[]>([])
    let onApply = (isApplied: boolean) => {
        setOpenFilter(false)
        setInitFitler(filter)
    }
    return (
        <TableFilterDrawer isOpen={isOpen} onApply={onApply} >
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full rounded-md border p-2 text-sm">
                        <option>All</option>
                        <option>Technology</option>
                        <option>Business</option>
                        <option>Design</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <select className="w-full rounded-md border p-2 text-sm">
                        <option>Newest</option>
                        <option>Oldest</option>
                        <option>Name (A–Z)</option>
                        <option>Name (Z–A)</option>
                    </select>
                </div>
            </div>
        </TableFilterDrawer>
    )
}

export default MenuFilterDrawer