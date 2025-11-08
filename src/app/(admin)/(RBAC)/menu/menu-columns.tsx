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
        header: "Tên",
    },
    {
        accessorKey: "path",
        header: "Đường dẫn",
    },
    {
        accessorKey: "isActive",
        header: "Hoạt động",
    },
    {
        accessorKey: "updatedAt",
        header: "Cập nhật lần cuối",
    },
]