"use client"

import {
    ColumnDef,
    flexRender,
    SortingState,
    ColumnFiltersState,
    getFilteredRowModel,

    getSortedRowModel,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,

} from "@tanstack/react-table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/shadcn/pagination"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,

} from "@/components/ui/shadcn/table"
import React from "react"
import Input from "@/components/form/input/InputField"
import { Button } from "@/components/ui/shadcn/button"
import { Plus, SlidersHorizontal, Upload } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    openAddModal?: any
}

export function DataTable<TData, TValue>({
    columns,
    data,
    openAddModal
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div >
            <div className="flex items-center gap-2 justify-between py-4">
                <div className="flex w-full items-center justify-between rounded-3xl">
                    <div className="relative w-full max-w-xl">
                        <Input
                            placeholder="Filter name..."
                            defaultValue={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="w-full rounded-full pl-9 pr-4 h-11 border-none shadow-sm bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                            />
                        </svg>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white shadow hover:bg-yellow-100 transition"
                >
                    <Plus className="h-4 w-4" />
                </Button>

                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white shadow hover:bg-yellow-100 transition"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                </Button>

                <Button
                    variant="secondary"
                    className="rounded-full bg-white shadow px-4 hover:bg-yellow-100 transition flex items-center gap-2"
                >
                    <Upload className="h-4 w-4" />
                    <span>Export</span>
                </Button>

            </div>
            <div className="overflow-hidden rounded-md border  p-2">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead className=" text-sm font-medium text-gray-500 tracking-wide" key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={`transition-all [&>td]:py-5`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>


            <Pagination className="flex items-center justify-end space-x-2 py-4">
                <PaginationContent>
                    {/* Previous */}
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                table.previousPage()
                            }}
                            className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {/* Page numbers */}
                    {(() => {
                        const totalPages = table.getPageCount()
                        const currentPage = table.getState().pagination.pageIndex + 1
                        const pages: (number | string)[] = []

                        if (totalPages <= 7) {
                            for (let i = 1; i <= totalPages; i++) pages.push(i)
                        } else {
                            if (currentPage <= 4) {
                                pages.push(1, 2, 3, 4, 5, "...", totalPages)
                            } else if (currentPage >= totalPages - 3) {
                                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
                            } else {
                                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
                            }
                        }

                        return pages.map((page, idx) =>
                            page === "..." ? (
                                <PaginationItem key={idx}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={idx}>
                                    <PaginationLink
                                        href="#"
                                        isActive={page === currentPage}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (typeof page === "number") {
                                                table.setPageIndex(page - 1)
                                            }
                                        }}
                                        className={
                                            page === currentPage
                                                ? "border-yellow-400 text-yellow-600 bg-yellow-50"
                                                : "hover:bg-yellow-50"
                                        }
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )
                    })()}

                    {/* Next */}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                table.nextPage()
                            }}
                            className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div >
    )
}