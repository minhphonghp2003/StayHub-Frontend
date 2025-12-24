// pages/list.tsx
import { PaginationComponent } from '@/components/ui/pagination/pagination-component';
import { CategoryItem } from '@/core/model/catalog/category-item';

interface Item {
    id?: number;
    name?: string;
    code?: string;
}

function PaginatedList({ items, onClick, selected, pageInfo, onPageChanged }: { items?: Item[], onClick?: any, selected?: any, onPageChanged?: any, pageInfo?: PageInfo | null }) {
    return (
        <div>

            <ul className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
                {items?.map(function (e, i) {
                    const isSelected = selected === e || selected === e.id;
                    return (
                        <li
                            key={i}
                            onClick={() => onClick(e)}
                            className={`cursor-pointer px-4 py-3 flex items-center justify-between ${isSelected ? "bg-brand-100 dark:bg-brand-500/[0.12]" : "hover:bg-gray-50 dark:hover:bg-gray-800/60"}  transition-colors `}
                        >
                            <span className={`${isSelected ? "text-brand-700 dark:text-brand-400" : " text-gray-800 dark:text-gray-100"}`}>{e.name}</span>
                        </li>
                    );
                })}
            </ul>
            <PaginationComponent visibleCount={3} currentPage={pageInfo?.currentPage ?? 1} totalPages={pageInfo?.totalPages ?? 1} onPageChange={onPageChanged} />

        </div>
    );
}



export default PaginatedList;
