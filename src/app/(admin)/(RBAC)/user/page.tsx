"use client"
import { getUserColumns } from "@/app/(admin)/(RBAC)/user/user-columns";
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { DataTable } from "@/components/ui/table/data-table";
import { TableFitler } from "@/core/model/application/filter";
import { User } from "@/core/model/RBAC/User";
import userService from "@/core/service/RBAC/user-service";
import { toastPromise } from "@/lib/alert-helper";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

function UserPage() {
    // ---------------query param------------
    const router = useRouter();
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const page = searchParams.get('page')
    // -------------- component sate-----

    let [loading, setLoading] = useState(true)
    let [userData, setUserData] = useState<User[]>([])
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
    useEffect(() => {

        fetchData()
    }, [page, search])
    // ---------------functions-----------------

    let fetchData = async () => {
        setLoading(true)
        let result = await userService.getAllUsers({ pageNumber: page, search })
        setUserData(result?.data ?? []);
        setPageInfo(result?.pageInfo ?? null);
        setLoading(false);
    }
    let onChangePage = useDebouncedCallback((page) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('page', page.toString());
        router.push(`?${currentParams.toString()}`);
    }, 500);
    let onToggleActive = async (user: User, value: boolean) => {
        const result = await toastPromise(userService.setActivateUser(user.id ?? 0, value),
            {
                loading: "Đang cập nhật trạng thái...",
                success: "Cập nhật trạng thái thành công!",
                error: "Cập nhật trạng thái thất bại!",
            })
        setUserData(prev =>
            prev.map(item =>
                item.id === user.id
                    ? { ...item, isActive: value, }
                    : item
            )
        );
    }
    let onSearch = useDebouncedCallback((value) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('search', value);
        router.push(`?${currentParams.toString()}`);
    }, 1000);

    const columns = getUserColumns({ onToggleActive });
    return (
        <div>
            <PageBreadcrumb pagePath='/user' pageTitle="Người dùng" />
            <DataTable search={search} columns={columns} data={userData} onSearch={onSearch} currentPage={pageInfo?.currentPage ?? 1} totalPage={pageInfo?.totalPages ?? 1} totalItems={pageInfo?.totalCount ?? 0} onPageChange={onChangePage} name="Danh sách người dùng" loading={loading} pageSize={pageInfo?.pageSize ?? 0} />

        </div>
    )
}

export default UserPage