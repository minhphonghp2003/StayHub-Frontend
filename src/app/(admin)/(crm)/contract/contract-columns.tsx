"use client";

import { Button } from "@/components/ui/shadcn/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu";
import { Contract } from "@/core/model/crm/contract";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, MoreHorizontal, Trash2 } from "lucide-react";

export interface ColumnProp {
    onDelete: (item: Contract) => void;
    onUpdate: (item: Contract) => void;
}

export const getContractColumns = ({ onDelete, onUpdate }: ColumnProp): ColumnDef<Contract>[] => [
    {
        id: "index",
        header: () => <p className="text-center">#</p>,
        cell: () => null,
        enableSorting: false,
        enableHiding: false,
        size: 50,
    },
    {
        accessorKey: "code",
        header: ({ column }) => (
            <Button
                className="flex justify-between w-full"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Mã HĐ
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "unit.name",
        header: "Căn hộ",
    },
    {
        accessorKey: "customers",
        header: "Khách thuê",
        cell: ({ row }: any) => {
            const contract: Contract = row.original;
            const customerNames = contract.customers?.map(c => c.name).join(", ") || "-";
            return <span>{customerNames}</span>;
        },
    },
    {
        accessorKey: "price",
        header: "Giá",
        cell: ({ row }: any) => {
            const contract: Contract = row.original;
            return (
                <span>
                    {contract.price?.toLocaleString("vi-VN")} ₫
                </span>
            );
        },
    },
    {
        accessorKey: "startDate",
        header: "Ngày bắt đầu",
    },
    {
        accessorKey: "endDate",
        header: "Ngày kết thúc",
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
    },

    {
        id: "actions",
        cell: ({ row }: any) => {
            const item = row.original;
            return (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    onUpdate(item);
                                }}
                            >
                                <Edit2 className="mr-2 w-4 h-4 opacity-70 text-blue-500" />
                                <span className="text-blue-500">Cập nhật</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    onDelete(item);
                                }}
                            >
                                <Trash2 className="mr-2 w-4 h-4 opacity-70 text-red-500" />
                                <span className="text-red-500">Xóa</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
