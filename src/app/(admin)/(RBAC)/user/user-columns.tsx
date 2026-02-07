"use client"

import Switch from "@/components/form/Switch"
import Badge from "@/components/ui/badge/Badge"
import { Button } from "@/components/ui/shadcn/button"
import { User } from "@/core/model/RBAC/User"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
const formatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
});
export interface ColumnProp {
    onToggleActive: (user: User, value: boolean) => void;
}

export const getUserColumns = ({ onToggleActive }: ColumnProp): ColumnDef<User>[] => [
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
                    <span className="mr-3 overflow-hidden rounded-full shadow-2xl border h-11 w-11">
                        {user.image ? (
                            <Image
                                width={44}
                                height={44}
                                src={user.image}
                                alt={user.fullname}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="w-full h-full flex items-center justify-center text-gray-500  text-lg">
                                {user.fullname?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        )}
                    </span>
                    <Link href={"/user-profile/" + user.id} className="text-blue-700">{user.fullname}</Link>
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
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
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
    {
        accessorKey: "isActive",
        id: "isActive",
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
        cell: ({ row }: any) => {
            const user = row.original;

            return (
                <div className="flex justify-between">
                    <Badge size="sm" color={row.getValue("isActive") ? 'success' : 'warning'}>
                        {row.getValue("isActive") ? "Đang hoạt động" : "Chưa kích hoạt"}
                    </Badge>
                    <Switch
                        defaultChecked={user.isActive}
                        onChange={(val) => onToggleActive(user, val)}
                        label={''} />
                </div>
            );
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
            const updatedAt = row.getValue<string>("updatedAt");
            const date = new Date(updatedAt);
            const formatted = formatter.format(date);
            return <div className="font-medium">{formatted}</div>
        },
    },


]