"use client"
import ActionList from '@/app/(admin)/(RBAC)/menu-action/action-list'
import MenuList from '@/app/(admin)/(RBAC)/menu-action/menu-list'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React from 'react'
import { Menu } from '@/core/model/RBAC/Menu'

function MenuActionPage() {
    let [selectedMenu, setSelectedMenu] = React.useState<Menu | null>(null)
    return (
        <div>
            <PageBreadcrumb pagePath='/menu-action' pageTitle="Phân quyền Menu" />
            <div className='grid grid-cols-4 gap-6'>
                <MenuList selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />
                <div className='col-span-3'>
                    <ActionList selectedMenu={selectedMenu} />
                </div>
            </div>
        </div>
    )
}

export default MenuActionPage