"use client";

import { Button } from "@/components/ui/shadcn/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu";
import { Job } from "@/core/model/infra/job";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import Switch from "@/components/form/Switch";

export interface ColumnProp {
    onDelete: (item: Job) => void;
    onUpdate: (item: Job) => void;
    onToggleActive?: (item: Job, checked: boolean) => void;
}

export const getJobColumns = ({ onDelete, onUpdate, onToggleActive }: ColumnProp): ColumnDef<Job>[] => [
    {
        id: "index",
        header: () => <p className="text-center">#</p>,
        cell: () => null,
        enableSorting: false,
        enableHiding: false,
        size: 50,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                className="flex justify-between w-full"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Tên
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-between gap-3">
                    <span>{row.getValue("name")}</span>
                    <Switch
                        defaultChecked={item.isActive}
                        onChange={(checked) => onToggleActive?.(item, checked)}
                        label=""
                    />
                </div>
            );
        },
    },
    {
        id: "unit",
        header: "Phòng",
        cell: ({ row }) => {
            const unit = row.original.unit;
            return <div>{unit?.name ?? ""}</div>;
        },
    },
    {
        accessorKey: "description",
        header: "Mô tả",
    },
    {
        id: "actions",
        cell: ({ row }: any) => {
            const item = row.original;
            return (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    onUpdate(item);
                                }}
                            >
                                <Edit2 className="mr-2 w-4 h-4 opacity-70 text-blue-500" />
                                <span className="text-blue-500">Cập nhật</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    onDelete(item);
                                }}
                            >
                                <Trash2 className="mr-2 w-4 h-4 opacity-70 text-red-500" />
                                <span className="text-red-500">Xóa</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
