"use client";

import { Button } from "@/components/ui/shadcn/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu";
import Badge from "@/components/ui/badge/Badge";
import Tooltip from "@/components/ui/tooltip/Tooltip";
import Switch from '@/components/form/Switch';
import { Unit } from "@/core/model/infra/unit";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, MoreHorizontal, Trash2 } from "lucide-react";

const getStatusVariant = (status: string): "light" | "solid" => {
    return "solid";
};

const getStatusColor = (status: string): "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" => {
    switch (status) {
        case "AVAILABLE":
            return "success";
        case "OCCUPIED":
            return "error";
        case "NOTICE_GIVEN":
            return "warning";
        case "RESERVED":
            return "info";
        case "MAINTENANCE":
            return "warning";
        case "DRAFT":
            return "light";
        default:
            return "primary";
    }
};

export interface ColumnProp {
    onDelete: (item: Unit) => void;
    onUpdate: (item: Unit) => void;
    onToggleActive?: (item: Unit, checked: boolean) => void;
}

export const getUnitColumns = ({ onDelete, onUpdate, onToggleActive }: ColumnProp): ColumnDef<Unit>[] => [
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
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-between gap-3">
                    <span>{row.getValue("name")}</span>
                    <Tooltip content={item.isActive ? "Deactivate" : "Activate"}>
                        <Switch
                            defaultChecked={item.isActive}
                            onChange={(checked) => onToggleActive?.(item, checked)}
                            label=""
                        />
                    </Tooltip>
                </div>
            );
        },
    },
    {
        accessorKey: "basePrice",
        header: ({ column }) => (
            <Button
                className="flex justify-between w-full"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Base Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const price = row.getValue<number>("basePrice");
            return <div>${price?.toFixed(2)}</div>;
        },
    },
    {
        accessorKey: "maximumCustomer",
        header: ({ column }) => (
            <Button
                className="flex justify-between w-full"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Max Customers
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        id: "unitGroup",
        header: "Unit Group",
        cell: ({ row }) => {
            const unitGroup = row.original.unitGroup;
            return <div>{unitGroup?.name}</div>;
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button
                className="flex justify-between w-full"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const status = row.getValue<string>("status");
            return <Badge color={getStatusColor(status)}>{status}</Badge>;
        },
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
                                <span className="text-blue-500">Update</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    onDelete(item);
                                }}
                            >
                                <Trash2 className="mr-2 w-4 h-4 opacity-70 text-red-500" />
                                <span className="text-red-500">Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];