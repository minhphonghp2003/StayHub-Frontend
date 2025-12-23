"use client"

import Switch from "@/components/form/Switch"
import Badge from "@/components/ui/badge/Badge"
import { Button } from "@/components/ui/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu"
import { Category } from "@/core/model/catalog/category"
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
export interface ColumnProp {
    onDelete: (category: Category) => void;
    onUpdate: (category: Category) => void;
}

export const getCategoryColumns = ({ onDelete, onUpdate }: ColumnProp): ColumnDef<Category>[] => [
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