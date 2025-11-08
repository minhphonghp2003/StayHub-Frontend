"use client"

import { Menu } from "@/core/model/RBAC/Menu"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Menu>[] = [
    {
        accessorKey: "icon",
        header: "Icon",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "path",
        header: "Path",
    },
    {
        accessorKey: "isActive",
        header: "IsActive",
    },
]