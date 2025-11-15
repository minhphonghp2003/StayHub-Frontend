"use client"

import ComponentCard from "@/components/common/ComponentCard"
import Input from "@/components/form/InputField"
import { PaginationComponent } from "@/components/ui/pagination/pagination-component"
import { Button } from "@/components/ui/shadcn/button"
import { Spinner } from "@/components/ui/shadcn/spinner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/shadcn/table"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,

    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { Plus, SlidersHorizontal, Upload } from "lucide-react"
import Image from "next/image"
import React, { ReactNode } from "react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    onAddClicked?: any
    onFilterClicked?: any,
    onExportClicked?: any,
    actions?: ReactNode[],
    onSearch?: ((e: string | null) => void) | undefined,
    search?: string | null,
    currentPage: number,
    totalPage: number,
    totalItems: number,
    pageSize: number,
    onPageChange: (page: number) => void,
    name: string,
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
    search,
    currentPage,
    totalPage,
    totalItems,
    pageSize,
    onPageChange,
    name,
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
        manualPagination: true,

        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),

    })

    return (
        <div >
            <ComponentCard desc={`Tổng cộng ${totalItems}`} title={name} >
                <DataTableHeader search={search} onFilterclicked={onFilterClicked} onAddClicked={onAddClicked} onExportClicked={onExportClicked} onSearch={onSearch} actions={actions} />

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
                                table.getRowModel().rows.map((row, rowIndex) => {

                                    return (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className={`transition-all  [&>td]:py-5 [&>td]:px-4`}
                                        >
                                            {row.getVisibleCells().map((cell) => {
                                                if (cell.column.id === "index") {
                                                    const pageIndex = currentPage; // from your state
                                                    const globalIndex = (pageIndex - 1) * pageSize + rowIndex + 1;

                                                    return (
                                                        <TableCell
                                                            key={cell.id}
                                                            className="border-r border-gray-100   dark:border-gray-800 text-center font-medium"
                                                        >
                                                            {globalIndex}
                                                        </TableCell>
                                                    );
                                                }
                                                return (
                                                    <TableCell className="border-r border-gray-100   dark:border-gray-800 last:border-r-0" key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow >
                                    <TableCell colSpan={columns.length} className="h-24 text-center ">
                                        {
                                            loading ? <Spinner className="size-8 mx-auto" /> :
                                                <div>
                                                    <Image color="red-100" className=" mx-auto" width={50} height={50} src={"/icons/box.png"} alt={""} />
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
                <PaginationComponent visibleCount={5} currentPage={currentPage} totalPages={totalPage} onPageChange={onPageChange} />

            </ComponentCard>
        </div >
    )
}


function DataTableHeader(
    { onAddClicked, onFilterclicked, onExportClicked, onSearch, actions, search }:
        {
            onAddClicked?: any
            onFilterclicked?: any
            onExportClicked?: any,
            actions?: ReactNode[],
            search?: string | null,
            onSearch?: ((e: string | null) => void) | undefined
        }
) {
    return (
        <div className="flex items-center gap-2 justify-between ">
            <div className="flex w-full items-center justify-between rounded-3xl">
                {

                    onSearch && <div className="relative w-full max-w-xl">
                        <Input
                            placeholder="Tìm kiếm..."
                            defaultValue={search ?? ""}
                            onChange={(e) => { onSearch(e.target.value) }}
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
                    <span>Xuất dữ liệu</span>
                </Button>
            }

        </div>
    )
}

