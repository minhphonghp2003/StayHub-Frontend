"use client"

import { Menu } from "@/core/model/RBAC/Menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu"
import { Button } from "@/components/ui/shadcn/button"
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
        accessorKey: "icon",
        header: "Icon",
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
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
        header: "Đường dẫn",
    },
    {
        accessorKey: "isActive",
        header: "Hoạt động",
    },
    {
        accessorKey: "updatedAt",
        header: () => <div className="text-right">Cập nhật lần cuối</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("updatedAt"))
            const formatted = formatter.format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const menu = row.original

            return (
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(menu.id?.toString() ?? "null")}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]