"use client"

import Switch from "@/components/form/Switch"
import Badge from "@/components/ui/badge/Badge"
import { Button } from "@/components/ui/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu"
import { CategoryItem } from "@/core/model/catalog/category-item"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit2, MoreHorizontal, Trash2 } from "lucide-react"
import { formatDate, formatDateTime } from "@/lib/utils"
export interface ColumnProp {
    onDelete: (categoryItem: CategoryItem) => void;
    onUpdate: (categoryItem: CategoryItem) => void;
}

export const getcategoryItemColumns = ({ onDelete, onUpdate }: ColumnProp): ColumnDef<CategoryItem>[] => [
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
        accessorKey: "code",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Mã
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "value",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Giá trị
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
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
            return <div className="font-medium">{formatDateTime(updatedAt)}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }: any) => {
            const item = row.original
            return (
                <div className='flex justify-center'>
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <MoreHorizontal className="h-4 w-4  " />

                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                                onUpdate(item)
                            }
                            }>
                                <Edit2 className="mr-2 w-4 h-4 opacity-70 text-blue-500" />
                                <span className='text-blue-500'>
                                    Cập nhật
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                onDelete(item)
                            }}>
                                <Trash2 className="mr-2 w-4 h-4 opacity-70 text-red-500" />
                                <span className='text-red-500'>Xóa</span>
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },

]