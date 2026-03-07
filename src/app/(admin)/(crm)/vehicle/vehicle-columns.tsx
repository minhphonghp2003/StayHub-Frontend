"use client";

import { Button } from "@/components/ui/shadcn/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/shadcn/dropdown-menu";
import { Vehicle } from "@/core/model/crm/vehicle";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, MoreHorizontal, Trash2 } from "lucide-react";

export interface ColumnProp {
    onDelete: (item: Vehicle) => void;
    onUpdate: (item: Vehicle) => void;
}

export const getVehicleColumns = ({ onDelete, onUpdate }: ColumnProp): ColumnDef<Vehicle>[] => [
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
                Tên xe
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }: any) => {
            const vehicle: Vehicle = row.original;
            return (
                <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg text-gray-500">
                        🚗
                    </span>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                            {vehicle.name}
                        </span>
                        <span className="text-sm text-gray-500">
                            {vehicle.licensePlate}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "customer.name",
        header: "Chủ xe",
    },
    {
        accessorKey: "licensePlate",
        header: "Biển số",
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
