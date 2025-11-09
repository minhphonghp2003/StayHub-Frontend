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
import React, { ReactNode } from "react"
import Input from "@/components/form/input/InputField"
import { Button } from "@/components/ui/shadcn/button"
import { Plus, SlidersHorizontal, Upload, X } from "lucide-react"
import ComponentCard from "@/components/common/ComponentCard"
import Badge from "@/components/ui/badge/Badge"
import { TableFitler } from "@/core/model/application/filter"
import { Spinner } from "@/components/ui/shadcn/spinner"
import Image from "next/image"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    onAddClicked?: any
    onFilterClicked?: any,
    onExportClicked?: any,
    actions?: ReactNode[],
    onSearch?: ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined,
    currentPage: number,
    totalPage: number,
    totalItems: number,
    onPageChange: (page: number) => void,
    name: string,
    filters?: TableFitler[],
    onRemoveFilter?: (filter: TableFitler) => void,
    loading: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onAddClicked,
    onExportClicked,
    onFilterClicked,
    actions,
    onSearch,
    currentPage,
    totalPage,
    totalItems,
    onPageChange,
    name,
    filters,
    onRemoveFilter,
    loading
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
            <ComponentCard desc={`Tổng cộng ${totalItems}`} title={name} >
                <DataTableHeader onFilterclicked={onFilterClicked} onAddClicked={onAddClicked} onExportClicked={onExportClicked} onSearch={onSearch} actions={actions} />
                {
                    filters?.map((e, i) => <Badge
                        key={i}
                        color="light"
                    >
                        {e.key.name}: {e.value.name}
                        <button
                            onClick={() => onRemoveFilter && onRemoveFilter(e)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>)
                }

                <div className="overflow-hidden rounded-md border px-4  py-2">
                    <Table>
                        <TableHeader >
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead className=" text-sm font-medium  text-gray-500 tracking-wide" key={header.id}>
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
                                        className={`transition-all  [&>td]:py-5 [&>td]:px-4`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell className="border-r border-gray-100   dark:border-gray-800 last:border-r-0" key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow >
                                    <TableCell colSpan={columns.length} className="h-24 text-center ">
                                        {
                                            loading ? <Spinner className="size-8 mx-auto" /> :
                                                <div>
                                                    <Image className=" mx-auto" width={50} height={50} src={"/icons/box.png"} alt={""} />
                                                    <p >
                                                        Chưa có dữ liệu
                                                    </p>
                                                </div>
                                        }
                                    </TableCell>

                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DataTablePaginating currentPage={currentPage} totalPages={totalPage} onPageChange={onPageChange} />

            </ComponentCard>
        </div >
    )
}


function DataTableHeader(
    { onAddClicked, onFilterclicked, onExportClicked, onSearch, actions }:
        {
            onAddClicked?: any
            onFilterclicked?: any
            onExportClicked?: any,
            actions?: ReactNode[],
            onSearch?: ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined
        }
) {
    return (
        <div className="flex items-center gap-2 justify-between ">
            <div className="flex w-full items-center justify-between rounded-3xl">
                {

                    onSearch && <div className="relative w-full max-w-xl">
                        <Input
                            placeholder="Tìm kiếm..."
                            onChange={onSearch}
                        />
                    </div>
                }
            </div>
            {
                onAddClicked && <Button
                    onClick={onAddClicked}
                    variant="default"
                    size="icon"
                >
                    <Plus className="h-4 w-4" />
                </Button>}
            {

                onFilterclicked && <Button
                    onClick={onFilterclicked}
                    variant="outline"
                    size="icon"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                </Button>
            }
            {actions?.map(e => e)}

            {

                onExportClicked && <Button
                    onClick={onExportClicked}
                    variant="outline"
                >
                    <Upload className="h-4 w-4" />
                    <span>Export</span>
                </Button>
            }

        </div>
    )
}


function DataTablePaginating({ currentPage,
    totalPages,
    onPageChange, }: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    }) {
    return (
        <Pagination className="flex items-center justify-end space-x-2 py-4">
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            onPageChange(currentPage - 1)
                        }}
                        className={currentPage == 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {/* Page numbers */}
                {(() => {
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
                                            // table.setPageIndex(page - 1)
                                        }
                                    }}
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
                            onPageChange(currentPage + 1)
                        }}
                        className={currentPage == totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
