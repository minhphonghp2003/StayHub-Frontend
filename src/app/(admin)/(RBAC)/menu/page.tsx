import MenuItem from '@/app/(admin)/(RBAC)/menu/menu-items/menu-items'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
async function MenuPage() {

    return (
        <div>
            <PageBreadcrumb pagePath='/menu' pageTitle="Menu" />
            <MenuItem />
        </div>
    )
}

export default MenuPage