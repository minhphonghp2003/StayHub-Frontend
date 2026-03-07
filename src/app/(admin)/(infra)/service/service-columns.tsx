"use client";

import { Button } from "@/components/ui/shadcn/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu";
import { Service } from "@/core/model/infra/service";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import Switch from "@/components/form/Switch";

export interface ColumnProp {
    onDelete: (item: Service) => void;
    onUpdate: (id: number) => void;
    onToggleActivate: (id: number, isActive: boolean) => void;
}

export const getServiceColumns = ({ onDelete, onUpdate, onToggleActivate }: ColumnProp): ColumnDef<Service>[] => [
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
            const name = row.getValue<string>("name");
            const isActive = row.original.isActive;
            return (
                <div className="flex items-center justify-between">
                    <span>{name}</span>
                    <Switch
                        defaultChecked={isActive ?? false}
                        onChange={(checked) => onToggleActivate(row.original.id ?? 0, checked)} label={""} />
                </div>
            );
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <Button
                className="flex justify-between w-full"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const price = row.getValue<number>("price");
            return <div>${price?.toFixed(2)}</div>;
        },
    },
    {
        id: "unitType",
        header: "Unit Type",
        cell: ({ row }) => {
            const unitType = row.original.unitType;
            return <div>{unitType?.name}</div>;
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
                                    onUpdate(item.id ?? 0);
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