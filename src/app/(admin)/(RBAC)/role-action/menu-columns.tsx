"use client"

import Checkbox from "@/components/form/Checkbox"
import Switch from "@/components/form/Switch"
import Badge from "@/components/ui/badge/Badge"
import { Button } from "@/components/ui/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu"
import { Menu } from "@/core/model/RBAC/Menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit2, MoreHorizontal, Trash2 } from "lucide-react"
const formatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
});
export const getMenuColumns = (): ColumnDef<Menu>[] => [
   {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    table.getIsSomePageRowsSelected()
                }
                onChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onChange={(value: any) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
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
    

]