"use client"
import Badge from "@/components/ui/badge/Badge";
import { DataTable } from "@/components/ui/table/data-table";
import { LoginActivity } from "@/core/model/RBAC/login-activity";
import { ColumnDef } from "@tanstack/react-table";

interface RecentLoginTabProps {
    activities: LoginActivity[];
    page: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (p: number) => void;
    loading: boolean;
}

export default function RecentLoginTab({
    activities,
    page,
    pageSize,
    totalItems,
    onPageChange,
    loading
}: RecentLoginTabProps) {

    // Exact column definition from My Activity (AccountTab)
    const columns: ColumnDef<LoginActivity>[] = [
        {
            accessorKey: "index",
            header: ({ column }) => <p className="text-center">#</p>,
            cell: ({ row }) => (
                <div className="text-center">
                    {(page - 1) * pageSize + row.index + 1}
                </div>
            ),
        },
        {
            accessorKey: "time",
            header: "Thời gian",
            cell: ({ row }) => {
                const date = new Date(row.original.time);
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">
                            {date.toLocaleDateString("vi-VN")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {date.toLocaleTimeString("vi-VN")}
                        </span>
                    </div>
                );
            }
        },
        {
            accessorKey: "os",
            header: "Thiết bị",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">
                        {row.original.os || "Unknown OS"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {row.original.browser || "Unknown Browser"}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "ip",
            header: "Địa chỉ IP",
            cell: ({ row }) => (
                <span className="font-mono text-sm">{row.original.ip}</span>
            )
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => (
                <Badge color={row.original.status ? 'success' : 'error'}>
                    {row.original.status ? 'Thành Công' : 'Thất Bại'}
                </Badge>
            ),
        },
    ];

    return (
        <div className="mt-6">
            <DataTable
                columns={columns}
                data={activities}
                name="Lịch sử hoạt động"
                currentPage={page}
                totalPage={Math.ceil(totalItems / pageSize) || 1}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={onPageChange}
                loading={loading}
                inCard={false}
            />
        </div>
    );
}