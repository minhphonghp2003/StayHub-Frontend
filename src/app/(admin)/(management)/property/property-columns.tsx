"use client"

import Badge from "@/components/ui/badge/Badge"
import { Button } from "@/components/ui/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu"
import { Tooltip } from "@/components/ui/tooltip/Tooltip"
import { Property } from "@/core/model/pmm/property"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit2, MoreHorizontal, Newspaper, Trash2 } from "lucide-react"

const formatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

export interface PropertyColumnProp {
    onDelete: (property: Property) => void;
    onUpdate: (property: Property) => void;
    onRenew: (property: Property) => void;
}

export const getPropertyColumns = ({ onDelete, onUpdate, onRenew }: PropertyColumnProp): ColumnDef<Property>[] => [
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
        accessorKey: "address",
        header: "Địa chỉ",
    },
    {
        accessorKey: "type.name",
        header: "Loại",
    },
    {
        accessorKey: "tier.name",
        header: "Gói dịch vụ",
    },
    {
        id: "subscriptionStatus",
        header: "Trạng thái",
        cell: ({ row }) => {
            const { startSubscriptionDate, endSubscriptionDate } = row.original

            if (!startSubscriptionDate && !endSubscriptionDate) return "-"

            const now = new Date()
            const end = endSubscriptionDate ? new Date(endSubscriptionDate) : undefined
            const start = startSubscriptionDate ? new Date(startSubscriptionDate) : undefined

            const tooltipText = `${start ? 'Bắt đầu: ' + formatter.format(start) : ''}\n${end ? 'Kết thúc: ' + formatter.format(end) : ''}`.trim()

            if (!end) {
                if (start && start <= now) {
                    return (
                        <Tooltip content={tooltipText}>
                            <Badge size="sm" color="success">Đang hoạt động</Badge>
                        </Tooltip>
                    )
                }
                return "-"
            }

            if (now > end) {
                return (
                    <Tooltip content={tooltipText}>
                        <Badge size="sm" color="error">Đã hết hạn</Badge>
                    </Tooltip>
                )
            }

            const diffMs = end.getTime() - now.getTime()
            const diffDays = diffMs / (1000 * 60 * 60 * 24)

            if (diffDays <= 7) {
                return (
                    <Tooltip content={tooltipText}>
                        <Badge size="sm" color="warning">Sắp hết hạn</Badge>
                    </Tooltip>
                )
            }

            return (
                <Tooltip content={tooltipText}>
                    <Badge size="sm" color="success">Đang hoạt động</Badge>
                </Tooltip>
            )
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Ngày cập nhật",
        cell: ({ row }) => {
            const date = row.original.updatedAt
            return date ? formatter.format(new Date(date)) : "-"
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const property = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-fit">
                        <DropdownMenuItem onClick={() => onRenew(property)} className="gap-2 cursor-pointer ">
                            <Newspaper className="h-4 w-4 " />
                            Gia hạn hợp đồng
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdate(property)} className="gap-2 cursor-pointer text-blue-500">
                            <Edit2 className="h-4 w-4 text-blue-500" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(property)} className="gap-2 cursor-pointer text-red-500">
                            <Trash2 className="h-4 w-4 text-red-500" />
                            Xoá
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
