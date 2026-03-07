"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useSelector } from 'react-redux';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { DataTable } from '@/components/ui/table/data-table';
import { RootState } from '@/redux/store';
import { PageInfo } from '@/core/model/BaseResponse';
import { Customer } from '@/core/model/crm/customer';
import { customerService } from '@/core/service/crm/customer-service';
import { getCustomerColumns } from './customer-columns';
import AddCustomerModal from './add-customer-modal';
import UpdateCustomerModal from './update-customer-modal';
import DeleteCustomerModal from './delete-customer-modal';

function CustomerPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    const page = searchParams.get("page");

    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [modal, setModalState] = useState<{
        type: "ADD" | "UPDATE" | "DELETE" | null;
        data: Customer | null;
    }>({ type: null, data: null });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Customer[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

    useEffect(() => {
        fetchData();
    }, [page, search, selectedPropertyId]);

    const fetchData = async () => {
        setLoading(true);
        setData([]);
        if (selectedPropertyId == null) {
            setLoading(false);
            return;
        }
        const result = await customerService.getAllCustomers({
            propertyId: selectedPropertyId,
            pageNumber: page ? Number(page) : undefined,
            pageSize: pageInfo?.pageSize,
            search: search || undefined,
        });
        if (result) {
            setData(result.data ?? []);
            setPageInfo(result.pageInfo ?? null);
        }
        setLoading(false);
    };

    const onChangePage = useDebouncedCallback((p) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set("page", p.toString());
        router.push(`?${currentParams.toString()}`);
    }, 500);

    const onSearch = useDebouncedCallback((value) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set("search", value);
        router.push(`?${currentParams.toString()}`);
    }, 1000);

    const columns = getCustomerColumns({
        onDelete: (c) => setModalState({ type: "DELETE", data: c }),
        onUpdate: (c) => setModalState({ type: "UPDATE", data: c }),
    });

    const closeModal = () => setModalState({ type: null, data: null });

    return (
        <div>
            <PageBreadcrumb pagePath="/customer" pageTitle="Khách hàng" />
            <div>
                <DataTable
                    search={search}
                    columns={columns}
                    data={data}
                    onAddClicked={() => setModalState({ type: "ADD", data: null })}
                    onSearch={onSearch}
                    currentPage={pageInfo?.currentPage ?? 1}
                    totalPage={pageInfo?.totalPages ?? 1}
                    totalItems={pageInfo?.totalCount ?? 0}
                    onPageChange={onChangePage}
                    name="Khách hàng"
                    loading={loading}
                    pageSize={pageInfo?.pageSize ?? 0}
                />
                {modal.type === "ADD" && (
                    <AddCustomerModal
                        isOpen={modal.type === "ADD"}
                        closeModal={closeModal}
                        reload={fetchData}
                    />
                )}
                {modal.type === "UPDATE" && modal.data && (
                    <UpdateCustomerModal
                        isOpen={modal.type === "UPDATE"}
                        closeModal={closeModal}
                        reload={fetchData}
                        customerId={modal.data.id ?? 0}
                    />
                )}
                {modal.type === "DELETE" && modal.data && (
                    <DeleteCustomerModal
                        isOpen={modal.type === "DELETE"}
                        onClose={closeModal}
                        onSuccess={fetchData}
                        customer={modal.data}
                    />
                )}
            </div>
        </div>
    );
}

export default CustomerPage