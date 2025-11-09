import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useEffect, useState } from 'react'
import MenuItem from '@/app/(admin)/(RBAC)/menu/menu-items/menu-items'
async function MenuPage() {

    return (
        <div>
            <PageBreadcrumb pagePath='/menu' pageTitle="Menu" />
            <MenuItem />
        </div>
    )
}

export default MenuPage