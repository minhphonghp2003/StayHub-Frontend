// pages/list.tsx
import { PaginationComponent } from '@/components/ui/pagination/pagination-component';
import { CategoryItem } from '@/core/model/catalog/category-item';

interface Item {
    id?: number;
    name?: string;
    code?: string;
    desc?: string
}

function PaginatedList({ items, onClick, selectedId, pageInfo, onPageChanged }: { items?: Item[], onClick?: any, selectedId?: number | null, onPageChanged?: any, pageInfo?: PageInfo | null }) {
    return (
        <div>

            <ul className="divide-y  divide-gray-200 dark:divide-gray-700 border-b  ">
                {items?.map(function (e, i) {
                    const isSelected = selectedId === e.id;
                    return (
                        <li
                            key={i}
                            onClick={() => onClick(e)}
                            className={`cursor-pointer px-4 py-3  ${isSelected ? "bg-brand-100 dark:bg-brand-500/[0.12] border-l-4 border-l-brand-500" : "hover:bg-gray-50 dark:hover:bg-gray-800/60"}  transition-colors `}
                        >
                            <p className={`${"font-normal text-gray-800 dark:text-gray-100"}`}>{e.name}</p>
                            <p className='text-sm text-gray-500'>{e.desc}</p>
                        </li>
                    );
                })}
            </ul>
            <PaginationComponent visibleCount={3} currentPage={pageInfo?.currentPage ?? 1} totalPages={pageInfo?.totalPages ?? 1} onPageChange={onPageChanged} />

        </div>
    );
}



export default PaginatedList;
