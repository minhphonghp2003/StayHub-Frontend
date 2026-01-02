"use client"

import Switch from "@/components/form/Switch"
import Badge from "@/components/ui/badge/Badge"
import { Button } from "@/components/ui/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu"
import { Action } from "@/core/model/RBAC/Action"
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
    onToggleAnon: (action: Action, value: boolean) => void;
}

export const getActionColumns = ({ onToggleAnon }: ColumnProp): ColumnDef<Action>[] => [
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
        accessorKey: "method",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Phương thức
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
        accessorKey: "allowAnonymous",
        id: "allowAnonymous",
        header: ({ column }) => {
            return (
                <Button
                    className="flex justify-between w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Phạm vi truy cập
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }: any) => {
            const item = row.original;

            return (
                <div className="flex justify-between">
                    <Badge size="sm" color={row.getValue("allowAnonymous") ? 'success' : 'warning'}>
                        {row.getValue("allowAnonymous") ? "Allow anonymous" : "Disallow anonymous"}
                    </Badge>
                    <Switch
                        defaultChecked={item.allowAnonymous}
                        onChange={(val) => onToggleAnon(item, val)}
                        label={''} />
                </div>
            );
        },
    },


]