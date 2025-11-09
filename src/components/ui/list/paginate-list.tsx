// pages/list.tsx
import ComponentCard from '@/components/common/ComponentCard';
import { PaginationComponent } from '@/components/ui/pagination/pagination-component';
import { Button } from '@/components/ui/shadcn/button';
import { SelectItem } from '@/components/ui/shadcn/select';
import { CategoryItem } from '@/core/model/catalog/category-item';
import React from 'react';


function ListPage({ items, onClick, onPageChanged, selected }: { items?: CategoryItem[], onClick?: any, onPageChanged?: any, selected?: any }) {
    return (
        <div>

            <ul className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
                {items?.map(function (e, i) {
                    const isSelected = selected === e || selected === e.id;
                    return (
                        <li
                            key={i}
                            onClick={onClick}
                            className="cursor-pointer px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                        >
                            <span className="text-gray-800 dark:text-gray-100">{e.name}</span>
                        </li>
                    );
                })}
            </ul>
            <PaginationComponent align='center' currentPage={1} totalPages={30} onPageChange={onPageChanged} />
        </div>
    );
}



export default ListPage;
