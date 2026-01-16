"use client"

import Switch from "@/components/form/Switch"
import Badge from "@/components/ui/badge/Badge"
import { Button } from "@/components/ui/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu"
import { User } from "@/core/model/RBAC/User"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit2, Menu, MoreHorizontal, Trash2 } from "lucide-react"
import Image from "next/image"
const formatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
});
export const getUserColumns = (): ColumnDef<User>[] => [
    {
        id: "index",
        header: ({ column }) => {
            return (
                <p className="text-center">#</p>
            )
        },
        cell: () => null,
        enableSorting: false,
        enableHiding: false,
        size: 50,
    },
    {
        accessorKey: "fullname",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Họ và tên
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }: any) => {
            const user = row.original;

            return (
                <div className="flex gap-2 items-center">
                    <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
                        <Image
                            width={44}
                            height={44}
                            src="/images/user/owner.jpg"
                            alt="User"
                        />
                    </span>
                    <div>{user.fullname}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "username",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên đăng nhập
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },

    {
        accessorKey: "phone",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    SDT
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },

]