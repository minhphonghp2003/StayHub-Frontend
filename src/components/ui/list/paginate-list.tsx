// pages/list.tsx
import ComponentCard from '@/components/common/ComponentCard';
import { PaginationComponent } from '@/components/ui/pagination/pagination-component';
import React from 'react';

type Item = {
    id: string;
    title: string;
    description?: string;
}

const items: Item[] = [
    { id: '1', title: 'Lorem ipsum dolor sit amet', description: 'It is a long established fact reader' },
    { id: '2', title: 'Lorem ipsum dolor sit amet' },
    { id: '3', title: 'Lorem ipsum dolor sit amet' },
    // more items...
];

const ListPage: React.FC = () => {
    return (
        <div>
            <ComponentCard title={'Menu grouop'} >
                List
                <PaginationComponent  align='center' currentPage={1} totalPages={30} onPageChange={function (page: number): void {
                    throw new Error('Function not implemented.');
                }} />
            </ComponentCard>
        </div>
    );
};

export default ListPage;
