"use client"
import AddItemModal from '@/app/(admin)/(setting)/categoryItem/add-item-modal';
import DeleteItemDialog from '@/app/(admin)/(setting)/categoryItem/delete-item-dialog';
import { getcategoryItemColumns } from '@/app/(admin)/(setting)/categoryItem/item-columns';
import ItemFilter from '@/app/(admin)/(setting)/categoryItem/item-filter';
import UpdateItemModal from '@/app/(admin)/(setting)/categoryItem/update-item-modal';
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { DataTable } from '@/components/ui/table/data-table';
import { TableFitler } from '@/core/model/application/filter';
import { CategoryItem } from '@/core/model/catalog/category-item';
import { Menu } from '@/core/model/RBAC/Menu';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce';
type ModalState = {
    type: 'ADD' | 'UPDATE' | 'DELETE' | null;
    data: CategoryItem | null;
}
function CategoryItemPage() {
    // ---------------query param------------
    const router = useRouter();
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const page = searchParams.get('page')
    const categoryId = searchParams.get('category')
    // -------------- component sate-----
    let [modal, setModalState] = useState<ModalState>({ type: null, data: null });
    let [loading, setLoading] = useState(true)
    let [categoryItemData, setCategoryItemData] = useState<CategoryItem[]>([])
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
    const [filter, setFilter] = useState<TableFitler[]>()
    const [openFilter, setOpenFilter] = React.useState(false)

    useEffect(() => {
        setFilter([
            {
                code: "CATEGORY",
                id: categoryId && parseInt(categoryId)
            }
        ])
        fetchData()
    }, [page, search, categoryId])
    let fetchData = async () => {
        setLoading(true)
        setCategoryItemData([])
        let result = await categoryItemService.getCategoryItemsByCategoryId({ categoryId: parseInt(categoryId ?? "0"), pageNumber: page, search, })
        setCategoryItemData(result?.data ?? []);
        setPageInfo(result ?? null);
        setLoading(false);
    }
    let onChangePage = useDebouncedCallback((page) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('page', page.toString());
        router.push(`?${currentParams.toString()}`);
    }, 500);

    let onSearch = useDebouncedCallback((value) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('search', value);
        router.push(`?${currentParams.toString()}`);
    }, 1000);
    let onFilter = (filtered: TableFitler[]) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        filtered.forEach(e => {
            if (e.code == "CATEGORY" && e.id) {
                currentParams.set('category', e.id.toString());
            }
        });
        router.push(`?${currentParams.toString()}`);
    }
    let onRemoveAllFilter = () => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.delete('group');
        router.push(`?${currentParams.toString()}`);
    }
    let closeModal = () => {
        setModalState({ type: null, data: null });
    }
    const columns = getcategoryItemColumns({ onDelete: (categoryItem) => setModalState({ type: 'DELETE', data: categoryItem }), onUpdate: (categoryItem) => setModalState({ type: 'UPDATE', data: categoryItem }), });
    return (
        <div>
            <PageBreadcrumb pagePath='/categoryItem' pageTitle="Category Item" />
            <DataTable search={search} onFilterClicked={() => setOpenFilter(true)} columns={columns} data={categoryItemData} onAddClicked={() => setModalState({ type: 'ADD', data: null })} onSearch={onSearch} currentPage={pageInfo?.currentPage ?? 1} totalPage={pageInfo?.totalPages ?? 1} totalItems={pageInfo?.totalCount ?? 0} onPageChange={onChangePage} name="Danh sách Category Item" loading={loading} pageSize={pageInfo?.pageSize ?? 0} />
            <AddItemModal isOpen={modal.type === 'ADD'} closeModal={closeModal} reload={fetchData} categoryId={categoryId ? parseInt(categoryId) : undefined} />
            <UpdateItemModal isOpen={modal.type === 'UPDATE' && modal.data !== null} closeModal={closeModal} item={modal.data} reload={fetchData} />
            <DeleteItemDialog isOpen={modal.type === 'DELETE' && modal.data !== null} closeModal={closeModal} item={modal.data} reload={fetchData} />
            <ItemFilter isOpen={openFilter} setOpenFilter={setOpenFilter} initFilter={filter} onFiltered={onFilter} onRemoveAllFilters={onRemoveAllFilter} />
        </div>
    )
}

export default CategoryItemPage