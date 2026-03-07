"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useSelector } from 'react-redux';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { DataTable } from '@/components/ui/table/data-table';
import { RootState } from '@/redux/store';
import { PageInfo } from '@/core/model/BaseResponse';
import { Vehicle } from '@/core/model/crm/vehicle';
import { vehicleService } from '@/core/service/crm/vehicle-service';
import { getVehicleColumns } from './vehicle-columns';
import AddVehicleModal from './add-vehicle-modal';
import UpdateVehicleModal from './update-vehicle-modal';
import DeleteVehicleModal from './delete-vehicle-modal';

function VehiclePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    const customerId = searchParams.get("customerId");

    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [modal, setModalState] = useState<{
        type: "ADD" | "UPDATE" | "DELETE" | null;
        data: Vehicle | null;
    }>({ type: null, data: null });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Vehicle[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
        customerId ? parseInt(customerId) : null
    );

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
        const result = await vehicleService.getAllVehicles({
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

    const columns = getVehicleColumns({
        onDelete: (v) => setModalState({ type: "DELETE", data: v }),
        onUpdate: (v) => setModalState({ type: "UPDATE", data: v }),
    });

    const closeModal = () => setModalState({ type: null, data: null });

    return (
        <div>
            <PageBreadcrumb pagePath="/vehicle" pageTitle="Xe" />
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
                    name="Xe"
                    loading={loading}
                    pageSize={pageInfo?.pageSize ?? 0}
                />
                {modal.type === "ADD" && (
                    <AddVehicleModal
                        isOpen={modal.type === "ADD"}
                        closeModal={closeModal}
                        reload={fetchData}
                        customerId={selectedCustomerId ?? 0}
                    />
                )}
                {modal.type === "UPDATE" && modal.data && (
                    <UpdateVehicleModal
                        isOpen={modal.type === "UPDATE"}
                        closeModal={closeModal}
                        reload={fetchData}
                        vehicleId={modal.data.id ?? 0}
                    />
                )}
                {modal.type === "DELETE" && modal.data && (
                    <DeleteVehicleModal
                        isOpen={modal.type === "DELETE"}
                        onClose={closeModal}
                        onSuccess={fetchData}
                        vehicle={modal.data}
                    />
                )}
            </div>
        </div>
    );
}

export default VehiclePage