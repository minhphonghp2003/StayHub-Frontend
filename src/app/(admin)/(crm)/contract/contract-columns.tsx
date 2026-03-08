"use client";

import { Button } from "@/components/ui/shadcn/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu";
import { Contract } from "@/core/model/crm/contract";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, MoreHorizontal, Trash2, RefreshCw, Move, LogOut, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface ColumnProp {
    onDelete: (item: Contract) => void;
    onUpdate: (item: Contract) => void;
    onRenew: (item: Contract) => void;
    onChangeRoom: (item: Contract) => void;
    onRegisterLeaving: (item: Contract) => void;
    onTransfer: (item: Contract) => void;
}

export const getContractColumns = ({ onDelete, onUpdate, onRenew, onChangeRoom, onRegisterLeaving, onTransfer }: ColumnProp): ColumnDef<Contract>[] => [
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
        accessorKey: "customer",
        header: "Khách thuê",
        cell: ({ row }: any) => {
            const contract: Contract = row.original;
            return (
                <span>
                    {contract.customer?.find(e => e.isRepresentative === true)?.name ?? contract.customer?.[0]?.name ?? "N/A"}
                </span>
            );
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
        accessorKey: "deposit",
        header: "Tiền cọc",
        cell: ({ row }: any) => {
            const contract: Contract = row.original;
            return (
                <span>
                    {contract.deposit?.toLocaleString("vi-VN")} ₫
                </span>
            );
        },
    },
    {
        accessorKey: "startDate",
        header: "Ngày bắt đầu",
        cell: ({ row }) => {
            const startDate = row.getValue<string>("startDate");
            return <span>{formatDate(startDate)}</span>;
        },
    },
    {
        accessorKey: "endDate",
        header: "Ngày kết thúc",
        cell: ({ row }) => {
            const endDate = row.getValue<string>("endDate");
            return <span>{formatDate(endDate)}</span>;
        },
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
                                    onRenew(item);
                                }}
                            >
                                <RefreshCw className="mr-2 w-4 h-4 opacity-70 text-green-500" />
                                <span className="text-green-500">Gia hạn hợp đồng</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    onChangeRoom(item);
                                }}
                            >
                                <Move className="mr-2 w-4 h-4 opacity-70 text-orange-500" />
                                <span className="text-orange-500">Chuyển phòng</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    onRegisterLeaving(item);
                                }}
                            >
                                <LogOut className="mr-2 w-4 h-4 opacity-70 text-purple-500" />
                                <span className="text-purple-500">Đăng ký rời đi</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    onTransfer(item);
                                }}
                            >
                                <FileText className="mr-2 w-4 h-4 opacity-70 text-indigo-500" />
                                <span className="text-indigo-500">Chuyển nhượng</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    onDelete(item);
                                }}
                            >
                                <Trash2 className="mr-2 w-4 h-4 opacity-70 text-red-500" />
                                <span className="text-red-500">Xóa (Hủy hợp đồng)</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
