"use client"
import AddUserModal from "@/app/(admin)/(RBAC)/user/add-user-modal";
import DeleteUserDialog from "@/app/(admin)/(RBAC)/user/delete-user-dialog"; // <-- Import Dialog
import { getUserColumns } from "@/app/(admin)/(RBAC)/user/user-columns";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/table/data-table";
import { User } from "@/core/model/RBAC/User";
import userService from "@/core/service/RBAC/user-service";
import { toastPromise } from "@/lib/alert-helper";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

function UserPage() {
    // ---------------query param------------
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    const page = searchParams.get('page');

    // -------------- component state-----
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null); // <-- Thêm state quản lý xóa

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<User[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

    useEffect(() => {
        fetchData();
    }, [page, search]);

    // ---------------functions-----------------
    const fetchData = async () => {
        setLoading(true);
        let result = await userService.getAllUsers({ pageNumber: page, search });
        setUserData(result?.data ?? []);
        setPageInfo(result?.pageInfo ?? null);
        setLoading(false);
    };

    const onChangePage = useDebouncedCallback((page) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('page', page.toString());
        router.push(`?${currentParams.toString()}`);
    }, 500);

    const onToggleActive = async (user: User, value: boolean) => {
        const result = await toastPromise(userService.setActivateUser(user.id ?? 0, value),
            {
                loading: "Đang cập nhật trạng thái...",
                success: "Cập nhật trạng thái thành công!",
                error: "Cập nhật trạng thái thất bại!",
            });

        if (result) {
            setUserData(prev =>
                prev.map(item =>
                    item.id === user.id
                        ? { ...item, isActive: value }
                        : item
                )
            );
        }
    };

    const onSearch = useDebouncedCallback((value) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('search', value);
        router.push(`?${currentParams.toString()}`);
    }, 1000);

    // Truyền hàm onDelete vào columns
    const columns = getUserColumns({
        onToggleActive,
        onDelete: (user) => setUserToDelete(user) // <-- Mở popup xóa
    });

    return (
        <div>
            <PageBreadcrumb pagePath='/user' pageTitle="Người dùng" />

            <DataTable
                search={search}
                columns={columns}
                data={userData}
                onSearch={onSearch}
                currentPage={pageInfo?.currentPage ?? 1}
                totalPage={pageInfo?.totalPages ?? 1}
                totalItems={pageInfo?.totalCount ?? 0}
                onPageChange={onChangePage}
                name="Danh sách người dùng"
                loading={loading}
                pageSize={pageInfo?.pageSize ?? 0}
                onAddClicked={() => setIsAddModalOpen(true)}
            />

            {/* Modal Thêm */}
            <AddUserModal
                isOpen={isAddModalOpen}
                closeModal={() => setIsAddModalOpen(false)}
                reload={fetchData}
            />

            {/* Modal Xóa */}
            <DeleteUserDialog
                isOpen={userToDelete !== null}
                closeModal={() => setUserToDelete(null)}
                user={userToDelete}
                reload={fetchData}
            />
        </div>
    )
}

export default UserPage;