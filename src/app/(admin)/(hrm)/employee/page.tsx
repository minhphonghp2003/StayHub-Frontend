"use client"

import AddEmployeeModal from "@/app/(admin)/(hrm)/employee/add-employee-modal";
import DeleteEmployeeDialog from "@/app/(admin)/(hrm)/employee/delete-employee-dialog";
import { getEmployeeColumns } from "@/app/(admin)/(hrm)/employee/employee-columns";
import UpdateEmployeeModal from "@/app/(admin)/(hrm)/employee/update-employee-modal";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/table/data-table";
import { User } from "@/core/model/RBAC/User";
import employeeService from "@/core/service/hrm/employee-service";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type ModalState = {
    type: 'ADD' | 'UPDATE' | 'DELETE' | null;
    data: User | null;
}

function EmployeePage() {

    const currentPropertyId = useSelector((state: RootState) => state.property.selectedPropertyId)
    const [modal, setModalState] = useState<ModalState>({ type: null, data: null });
    const [loading, setLoading] = useState(true);
    const [employeeData, setEmployeeData] = useState<User[]>([]);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        if (!currentPropertyId) return;
        fetchData(pageNumber);
    }, [pageNumber, currentPropertyId]);

    const closeModal = () => setModalState({ type: null, data: null });

    const fetchData = async (page: number) => {
        setLoading(true);
        const result = await employeeService.getAllEmployees(currentPropertyId ?? 0, {
            pageNumber: page,
            pageSize
        });

        if (result) {
            setEmployeeData(result.data);
            setTotalItems(result.pageInfo?.totalCount ?? 0);
            setTotalPage(result.pageInfo?.totalPages ?? 1);
        }
        setLoading(false);
    }

    const columns = getEmployeeColumns({
        onDelete: (emp) => setModalState({ type: 'DELETE', data: emp }),
        onUpdate: (emp) => setModalState({ type: 'UPDATE', data: emp }),
    });

    return (
        <div>
            <PageBreadcrumb pagePath='/employee' pageTitle="Nhân viên" />
            <DataTable
                columns={columns}
                data={employeeData}
                onAddClicked={() => setModalState({ type: 'ADD', data: null })}
                name="Danh sách Nhân viên"
                loading={loading}
                currentPage={pageNumber}
                totalPage={totalPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={(page: number) => setPageNumber(page)}
            />

            <AddEmployeeModal
                propertyId={currentPropertyId??0}
                isOpen={modal.type === 'ADD'}
                closeModal={closeModal}
                reload={() => fetchData(pageNumber)}
            />
            <UpdateEmployeeModal
                propertyId={currentPropertyId??0}
                isOpen={modal.type === 'UPDATE' && modal.data !== null}
                closeModal={closeModal}
                employee={modal.data}
                reload={() => fetchData(pageNumber)}
            />
            <DeleteEmployeeDialog
                propertyId={currentPropertyId??0}
                isOpen={modal.type === 'DELETE' && modal.data !== null}
                closeModal={closeModal}
                employee={modal.data}
                reload={() => fetchData(pageNumber)}
            />
        </div>
    )
}

export default EmployeePage