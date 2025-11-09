"use client"

import { Menu } from "@/core/model/RBAC/Menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Check, MoreHorizontal, X } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu"
import { Button } from "@/components/ui/shadcn/button"
import { useModal } from "@/hooks/useModal"
import AddMenuModal from "./add-menu-modal"
import Badge from "@/components/ui/badge/Badge"
const formatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
});

export const menuColumns: ColumnDef<Menu>[] = [
    {
        id: "index",
        header: ({ column }) => {
            return (
                <p className="text-center">#</p>
            )
        },
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex; // current page
            const pageSize = table.getState().pagination.pageSize;   // rows per page
            return <p className="text-center">
                {pageIndex * pageSize + row.index + 1}
            </p>
        },
        enableSorting: false,
        enableHiding: false,
        size: 50,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },

    {
        accessorKey: "path",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Đường dẫn
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "groupName",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Thuộc nhóm
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Trạng thái
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <Badge size="sm" color="success">
                {row.getValue("isActive") ? "Đang kích hoạt" : "Chưa kích hoạt"}
            </Badge>


        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Cập nhật lần cuối
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("updatedAt"))
            const formatted = formatter.format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        id: "actions",
        cell: () => null,
    },

]