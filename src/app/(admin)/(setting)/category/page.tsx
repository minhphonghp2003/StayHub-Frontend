"use client"
import AddCategoryModal from "@/app/(admin)/(setting)/category/add-category-modal";
import { getCategoryColumns } from "@/app/(admin)/(setting)/category/category-columns";
import DeleteCategoryModal from "@/app/(admin)/(setting)/category/delete-category-modal";
import UpdateCategoryModal from "@/app/(admin)/(setting)/category/update-category-modal";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/table/data-table";
import { Category } from "@/core/model/catalog/category";
import { categoryService } from "@/core/service/catalog/category-service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
type ModalState = {
    type: 'ADD' | 'UPDATE' | 'DELETE' | null;
    data: Category | null;
}
function CategoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const page = searchParams.get('page')
    let [modal, setModalState] = useState<ModalState>({ type: null, data: null });
    let [loading, setLoading] = useState(true)
    let [categoryData, setcategoryData] = useState<Category[]>([])
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
    useEffect(() => {

        fetchData()
    }, [page, search])
    // ---------------functions-----------------
    let closeModal = () => {
        setModalState({ type: null, data: null });
    }
    let fetchData = async () => {
        setLoading(true)
        setcategoryData([])
        let result = await categoryService.getAllCategories({ pageNumber: page, search, })
        setcategoryData(result?.data ?? []);
        setPageInfo(result?.pageInfo ?? null);
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
    const columns = getCategoryColumns({ onDelete: (category) => setModalState({ type: 'DELETE', data: category }), onUpdate: (category) => setModalState({ type: 'UPDATE', data: category }), });
    return (
        <div><PageBreadcrumb pagePath='/category' pageTitle="Category" />
            <div>

                <DataTable search={search} columns={columns} data={categoryData} onAddClicked={() => setModalState({ type: 'ADD', data: null })} onSearch={onSearch} currentPage={pageInfo?.currentPage ?? 1} totalPage={pageInfo?.totalPages ?? 1} totalItems={pageInfo?.totalCount ?? 0} onPageChange={onChangePage} name="Danh sách Category" loading={loading} pageSize={pageInfo?.pageSize ?? 0} />
                <AddCategoryModal isOpen={modal.type === 'ADD'} closeModal={closeModal} reload={fetchData} />
                <UpdateCategoryModal isOpen={modal.type === 'UPDATE' && modal.data !== null} closeModal={closeModal} category={modal.data} reload={fetchData} />
                <DeleteCategoryModal isOpen={modal.type === 'DELETE' && modal.data !== null} closeModal={closeModal} category={modal.data} reload={fetchData} />
            </div>
        </div>
    )
}

export default CategoryPage