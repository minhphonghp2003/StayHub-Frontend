import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useEffect, useState } from 'react'
import MenuItem from '@/app/(admin)/(RBAC)/menu/menu-items/menu-items'
// TODO use query param as filtering
interface MenuPageProp {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
async function MenuPage({ searchParams }: MenuPageProp) {
    let page = (await searchParams).page
    let search = (await searchParams).search
    console.log(page, search);
    return (
        <div>
            <PageBreadcrumb pagePath='/menu' pageTitle="Menu" />
            <MenuItem />
        </div>
    )
}

export default MenuPage