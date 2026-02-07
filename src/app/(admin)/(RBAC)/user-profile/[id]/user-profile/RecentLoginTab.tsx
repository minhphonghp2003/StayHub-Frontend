"use client"
import Badge from "@/components/ui/badge/Badge";
import { DataTable } from "@/components/ui/table/data-table";
import { ColumnDef } from "@tanstack/react-table";

export interface LoginActivity {
    id: string;
    dateTime: string;
    ipAddress: string;
    device: string;
    geo?: string;
    status: "Success" | "Failed";
    createdAt?: string;
}

export default function RecentLoginTab({
    activities,
    page,
    pageSize,
    onPageChange,
}: {
    activities: LoginActivity[];
    page: number;
    pageSize: number;
    onPageChange: (p: number) => void;
}) {
    const columns: ColumnDef<LoginActivity>[] = [
        {
            accessorKey: "dateTime",
            header: "NGÀY & GIỜ",
        },
        {
            accessorKey: "ipAddress",
            header: "ĐỊA CHỈ IP",
        },
        {
            accessorKey: "device",
            header: "THIẾT BỊ",
        },
        {
            accessorKey: "status",
            header: "TRẠNG THÁI",
            cell: (info) => (

                <Badge color={info.getValue() === 'Success' ? 'success' : 'error'}>
                    {info.getValue() === 'Success' ? 'Thành Công' : 'Thất Bại'}
                </Badge>
                // <div className={`text-sm ${info.getValue() === 'Success' ? 'text-green-600' : 'text-red-600'}`}>
                //     {info.getValue() === 'Success' ? 'Thành Công' : 'Thất Bại'}
                // </div>
            ),
        },
    ];

    return (
        <div className="mt-6">
            <DataTable
                columns={columns}
                data={activities}
                name="Login Activity"
                currentPage={page}
                totalPage={Math.ceil(activities.length / pageSize)}
                totalItems={activities.length}
                pageSize={pageSize}
                onPageChange={onPageChange}
                loading={false}
                inCard={false}
            />
        </div>
    );
}
