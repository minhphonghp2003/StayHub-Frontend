import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/shadcn/pagination"

export function PaginationComponent({
    currentPage,
    totalPages,
    visibleCount = 3,
    onPageChange,
    align,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    align?: "end" | "center";
    visibleCount?: number;
}) {
    const safeVisible = Math.max(3, visibleCount); // at least 3 visible icons
    const half = Math.floor(safeVisible / 2);

    const getPages = (): (number | string)[] => {
        if (totalPages <= safeVisible + 2) {

            return Array.from({ length: totalPages }, (_, i) => i + 1); // ✅ 1-based pages
        }

        const pages: (number | string)[] = [];

        // Always show first & last page
        pages.push(1);

        // Calculate window range
        let start = Math.max(currentPage - half, 2);
        let end = Math.min(currentPage + half, totalPages - 1);

        // Adjust window when near start or end
        if (currentPage <= half + 1) {
            end = safeVisible;
        } else if (currentPage >= totalPages - half) {
            start = totalPages - safeVisible + 1;
        }

        if (start > 2) pages.push("...");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);

        // Ensure only one ellipsis
        return pages.filter((p, i, arr) => p !== "..." || arr.indexOf("...") === i);
    };

    const pages = getPages();


    return (
        <Pagination
            className={`flex items-center ${align === "center" ? "justify-center" : "justify-end"
                } space-x-3 py-4`}
        >
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                                    e.preventDefault();
                                    if (typeof page === "number") onPageChange(page);
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
                            e.preventDefault();
                            if (currentPage < totalPages) onPageChange(currentPage + 1);
                        }}
                        className={
                            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

