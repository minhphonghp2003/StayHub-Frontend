"use client"

import { Button } from "@/components/ui/shadcn/button"
import { User } from "@/core/model/RBAC/User"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

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
                    <Link href={"/user-profile/" + user.id} className="text-blue-600">{user.fullname}</Link>
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