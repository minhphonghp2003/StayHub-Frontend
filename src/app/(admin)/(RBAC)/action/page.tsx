"use client";
import { getActionColumns } from '@/app/(admin)/(RBAC)/action/action-columns';
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { Button } from '@/components/ui/shadcn/button';
import { DataTable } from '@/components/ui/table/data-table';
import { TableFitler } from '@/core/model/application/filter';
import { Action } from '@/core/model/RBAC/Action';
import actionService from '@/core/service/RBAC/action-service';
import { toastPromise } from '@/lib/alert-helper';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

function ActionPage() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const page = searchParams.get('page')
    // -------------- component sate-----
    let [loading, setLoading] = useState(true)
    let [actionData, setActionData] = useState<Action[]>([])
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
    useEffect(() => {

        fetchData()
    }, [page, search,])

    let fetchData = async () => {
        setLoading(true)
        setActionData([])
        let result = await actionService.getAllActions({ pageNumber: page, search, })
        setActionData(result?.data ?? []);
        setPageInfo(result?.pageInfo ?? null);
        setLoading(false);
    }
    let onChangePage = useDebouncedCallback((page) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('page', page.toString());
        router.push(`?${currentParams.toString()}`);
    }, 500);
    let onToggleAnon = async (action: Action, value: boolean) => {
        const result = await toastPromise(actionService.allowAnonActionAction(action.id ?? 0, value),
            {
                loading: "Đang cập nhật trạng thái...",
                success: "Cập nhật trạng thái thành công!",
                error: "Cập nhật trạng thái thất bại!",
            })
        setActionData(prev =>
            prev.map(item =>
                item.id === action.id
                    ? { ...item, allowAnonymous: value, }
                    : item
            )
        );
    }
    let onGenerateAction = async () => {
        const result = await toastPromise(actionService.generateAction(),
            {
                loading: "Đang generate action...",
                success: "Generate action thành công!",
                error: "Generate action thất bại!",
            })
        fetchData();
    }
    let onSearch = useDebouncedCallback((value) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set('search', value);
        router.push(`?${currentParams.toString()}`);
    }, 1000);

    const columns = getActionColumns({ onToggleAnon });
    let generateAction = [
        <Button key={0} onClick={onGenerateAction}>Generate Action</Button>
    ]
    return (
        <div>
            <PageBreadcrumb pagePath='/action' pageTitle="Action" />
            <DataTable search={search} columns={columns} data={actionData} onSearch={onSearch} currentPage={pageInfo?.currentPage ?? 1} totalPage={pageInfo?.totalPages ?? 1} totalItems={pageInfo?.totalCount ?? 0} onPageChange={onChangePage} name="Danh sách Action" loading={loading} pageSize={pageInfo?.pageSize ?? 0} actions={generateAction} />

        </div>
    )
}

export default ActionPage