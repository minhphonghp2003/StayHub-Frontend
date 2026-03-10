"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { DataTable } from '@/components/ui/table/data-table';
import { RootState } from '@/redux/store';
import { PageInfo } from '@/core/model/BaseResponse';
import { Contract } from '@/core/model/crm/contract';
import { contractService } from '@/core/service/crm/contract-service';
import { FormSelect } from "@/components/form/Select";
import AddContractModal from './add-contract-modal';
import UpdateContractModal from './update-contract-modal';
import DeleteContractModal from './delete-contract-modal';
import RenewContractModal from './renew-contract-modal';
import ChangeRoomModal from './change-room-modal';
import RegisterLeavingModal from './register-leaving-modal';
import TransferContractModal from './transfer-contract-modal';
import { getContractColumns } from '@/app/(admin)/(crm)/contract/contract-columns';

function ContractPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    const status = searchParams.get("status");

    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [modal, setModalState] = useState<{
        type: "ADD" | "UPDATE" | "DELETE" | "RENEW" | "CHANGE_ROOM" | "REGISTER_LEAVING" | "TRANSFER" | null;
        data: Contract | null;
    }>({ type: null, data: null });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Contract[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

    const form = useForm({
        defaultValues: {
            status: status === "" ? "all" : status || "",
        },
    });

    useEffect(() => {
        fetchData();
    }, [page, search, status, selectedPropertyId]);

    useEffect(() => {
        form.setValue("status", status === "" ? "all" : status || "");
    }, [status, form]);

    const fetchData = async () => {
        setLoading(true);
        setData([]);
        if (selectedPropertyId == null) {
            setLoading(false);
            return;
        }
        const result = await contractService.getAllContracts({
            propertyId: selectedPropertyId,
            status: status || undefined,
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

    const onStatusChange = (value: string) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        const statusValue = value === "all" ? "" : value;
        if (statusValue) {
            currentParams.set("status", statusValue);
        } else {
            currentParams.delete("status");
        }
        router.push(`?${currentParams.toString()}`);
    };

    const columns = getContractColumns({
        onDelete: (c) => setModalState({ type: "DELETE", data: c }),
        onUpdate: (c) => setModalState({ type: "UPDATE", data: c }),
        onRenew: (c) => setModalState({ type: "RENEW", data: c }),
        onChangeRoom: (c) => setModalState({ type: "CHANGE_ROOM", data: c }),
        onRegisterLeaving: (c) => setModalState({ type: "REGISTER_LEAVING", data: c }),
        onTransfer: (c) => setModalState({ type: "TRANSFER", data: c }),
    });

    const closeModal = () => setModalState({ type: null, data: null });

    return (
        <div>
            <PageBreadcrumb pagePath="/contract" pageTitle="Hợp đồng" />
            <div className="mb-4 flex gap-4">
                <FormSelect
                    name="status"
                    control={form.control}
                    label="Trạng thái"
                    options={[
                        { value: "all", label: "Tất cả" },
                        { value: "Pending", label: "Chờ duyệt" },
                        { value: "Active", label: "Đang hiệu lực" },
                        { value: "ExpiringSoon", label: "Sắp hết hạn" },
                        { value: "Expired", label: "Đã hết hạn" },
                        { value: "Terminated", label: "Đã thanh lý" },
                        { value: "Canceled", label: "Đã hủy" },
                    ]}
                    placeholder="Chọn trạng thái"
                    onChange={onStatusChange}
                />
            </div>
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
                    name="Hợp đồng"
                    loading={loading}
                    pageSize={pageInfo?.pageSize ?? 0}
                />
                {modal.type === "ADD" && (
                    <AddContractModal
                        isOpen={modal.type === "ADD"}
                        closeModal={closeModal}
                        reload={fetchData}
                    />
                )}
                {modal.type === "UPDATE" && modal.data && (
                    <UpdateContractModal
                        isOpen={modal.type === "UPDATE"}
                        closeModal={closeModal}
                        reload={fetchData}
                        contractId={modal.data.id ?? 0}
                    />
                )}
                {modal.type === "DELETE" && modal.data && (
                    <DeleteContractModal
                        isOpen={modal.type === "DELETE"}
                        onClose={closeModal}
                        onSuccess={fetchData}
                        contract={modal.data}
                    />
                )}
                {modal.type === "RENEW" && modal.data && (
                    <RenewContractModal
                        isOpen={modal.type === "RENEW"}
                        closeModal={closeModal}
                        reload={fetchData}
                        contract={modal.data}
                    />
                )}
                {modal.type === "CHANGE_ROOM" && modal.data && (
                    <ChangeRoomModal
                        isOpen={modal.type === "CHANGE_ROOM"}
                        closeModal={closeModal}
                        reload={fetchData}
                        contract={modal.data}
                    />
                )}
                {modal.type === "REGISTER_LEAVING" && modal.data && (
                    <RegisterLeavingModal
                        isOpen={modal.type === "REGISTER_LEAVING"}
                        closeModal={closeModal}
                        reload={fetchData}
                        contract={modal.data}
                    />
                )}
                {modal.type === "TRANSFER" && modal.data && (
                    <TransferContractModal
                        isOpen={modal.type === "TRANSFER"}
                        closeModal={closeModal}
                        reload={fetchData}
                        contract={modal.data}
                    />
                )}
            </div>
        </div>
    );
}

export default ContractPage