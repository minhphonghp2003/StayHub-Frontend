import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React from 'react'
import { DataTable } from './menu-data-table'
import { columns } from './menu-columns'
import { Menu } from '@/core/model/RBAC/Menu';
import MenuService from '@/core/service/RBAC/MenuService';

async function MenuPage() {
    let data: Menu[] = [];
    data = await MenuService.getMyMenus();
    return (
        <div>
            <PageBreadcrumb pagePath='/menu' pageTitle="Menu" />
            <DataTable columns={columns} data={data} />

        </div>
    )
}

export default MenuPage