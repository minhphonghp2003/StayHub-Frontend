"use client"

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
export interface ColumnProp {
    onDelete: (menu: Menu) => void;
    onUpdate: (menu: Menu) => void;
    onToggleActive: (menu: Menu, value: boolean) => void;
}

export const getMenuColumns = ({ onDelete, onUpdate, onToggleActive }: ColumnProp): ColumnDef<Menu>[] => [
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
            const menu = row.original;

            return (
                <div className="flex justify-between">
                    <Badge size="sm" color={row.getValue("isActive") ? 'success' : 'warning'}>
                        {row.getValue("isActive") ? "Đang kích hoạt" : "Chưa kích hoạt"}
                    </Badge>
                    <Switch
                        defaultChecked={menu.isActive}
                        onChange={(val) => onToggleActive(menu, val)}
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
    {
        id: "actions",
        cell: ({ row }: any) => {
            const menu = row.original
            return (
                <div className='flex justify-center'>
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <MoreHorizontal className="h-4 w-4  " />

                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                                onUpdate(menu)
                            }
                            }>
                                <Edit2 className="mr-2 w-4 h-4 opacity-70 text-blue-500" />
                                <span className='text-blue-500'>
                                    Cập nhật
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                onDelete(menu)
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