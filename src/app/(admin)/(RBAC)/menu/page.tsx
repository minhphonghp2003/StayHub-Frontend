'use client'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useEffect, useState } from 'react'
import { DataTable } from './menu-data-table'
import { columns } from './menu-columns'
import { Menu } from '@/core/model/RBAC/Menu';
import MenuService from '@/core/service/RBAC/MenuService';
import ComponentCard from '@/components/common/ComponentCard'

function MenuPage() {
    let [data, setData] = useState<Menu[]>([])
    useEffect(() => {
        MenuService.getAllMenus().then(e => setData(e))
    }, [])
    return (
        <div>
            <PageBreadcrumb pagePath='/menu' pageTitle="Menu" />
            <ComponentCard title="Danh sách Menu">
                <DataTable columns={columns} data={data} />
            </ComponentCard>

        </div>
    )
}

export default MenuPage