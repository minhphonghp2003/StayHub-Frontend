import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/shadcn/pagination"

export function DataTablePagination({ table }: { table: any }) {
    const totalPages = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex + 1

    const getPageNumbers = () => {
        const pages = []
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
        return pages
    }

    const pages = getPageNumbers()

    return (
        <Pagination className="mt-4">
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
                {pages.map((page, idx) =>
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
                                    table.setPageIndex(page - 1)
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

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
    )
}
