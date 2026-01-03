"use client"

import AddMenuModal from "@/app/(admin)/(RBAC)/menu/menu-items/add-menu-modal";
import DeleteMenuDialog from "@/app/(admin)/(RBAC)/menu/menu-items/delete-menu-dialog";
import MenuFilterDrawer from "@/app/(admin)/(RBAC)/menu/menu-items/menu-filter";
import UpdateMenuModal from "@/app/(admin)/(RBAC)/menu/menu-items/update-menu-modal";
import AddRoleModal from "@/app/(admin)/(RBAC)/role/add-role-modal";
import DeleteRoleDialog from "@/app/(admin)/(RBAC)/role/delete-role-dialog";
import { getRoleColumns } from "@/app/(admin)/(RBAC)/role/role-columns";
import UpdateRoleModal from "@/app/(admin)/(RBAC)/role/update-role-modal";
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { DataTable } from "@/components/ui/table/data-table";
import { Role } from "@/core/model/RBAC/Role";
import roleService from "@/core/service/RBAC/role-service";
import { useEffect, useState } from "react";
type ModalState = {
    type: 'ADD' | 'UPDATE' | 'DELETE' | null;
    data: Role | null;
}
function RolePage() {

    let [modal, setModalState] = useState<ModalState>({ type: null, data: null });
    let [loading, setLoading] = useState(true)
    let [roleData, setRoleData] = useState<Role[]>([])


    useEffect(() => {

        fetchData()
    }, [])
    // ---------------functions-----------------
    let closeModal = () => {
        setModalState({ type: null, data: null });
    }
    let fetchData = async () => {
        setLoading(true)
        setRoleData([])
        let result = await roleService.getAllRoles()
        setRoleData(result ?? []);
        setLoading(false);
    }

    const columns = getRoleColumns({ onDelete: (menu) => setModalState({ type: 'DELETE', data: menu }), onUpdate: (menu) => setModalState({ type: 'UPDATE', data: menu }), });
    return (
        <div>
            <PageBreadcrumb pagePath='/role' pageTitle="Role" />
            <DataTable columns={columns} data={roleData} onAddClicked={() => setModalState({ type: 'ADD', data: null })} name="Danh sách Role" loading={loading} currentPage={0} totalPage={0} totalItems={0} pageSize={0} onPageChange={function (page: number): void {
            }} />
            <AddRoleModal isOpen={modal.type === 'ADD'} closeModal={closeModal} reload={fetchData} />
            <UpdateRoleModal isOpen={modal.type === 'UPDATE' && modal.data !== null} closeModal={closeModal} role={modal.data} reload={fetchData} />
            <DeleteRoleDialog isOpen={modal.type === 'DELETE' && modal.data !== null} closeModal={closeModal} role={modal.data} reload={fetchData} />
        </div>
    )
}

export default RolePage