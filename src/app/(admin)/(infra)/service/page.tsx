"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useSelector } from "react-redux";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/table/data-table";
import { RootState } from "@/redux/store";
import { Service } from "@/core/model/infra/service";
import { serviceService } from "@/core/service/infra/service-service";
import { toastPromise } from "@/lib/alert-helper";
import AddServiceModal from "@/app/(admin)/(infra)/service/add-service-modal";
import DeleteServiceModal from "@/app/(admin)/(infra)/service/delete-service-modal";
import { getServiceColumns } from "@/app/(admin)/(infra)/service/service-columns";
import UpdateServiceModal from "@/app/(admin)/(infra)/service/update-service-modal";

type ModalState = {
    type: "ADD" | "UPDATE" | "DELETE" | null;
    data: Service | number | null;
};

function ServicePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    const page = searchParams.get("page");

    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [modal, setModalState] = useState<ModalState>({ type: null, data: null });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Service[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

    useEffect(() => {
        fetchData();
    }, [page, search, selectedPropertyId]);

    // ---------------- functions ----------------
    const closeModal = () => {
        setModalState({ type: null, data: null });
    };

    const fetchData = async () => {
        setLoading(true);
        setData([]);
        if (selectedPropertyId == null) {
            setLoading(false);
            return;
        }
        const result = await serviceService.getAllServices({
            propertyId: selectedPropertyId,
            pageNumber: page ? Number(page) : undefined,
            search: search || undefined,
        });
        setData(result?.data ?? []);
        setPageInfo(result?.pageInfo ?? null);
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

    const onToggleActivate = async (id: number, isActive: boolean) => {
        setData((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, isActive }
                    : item
            )
        );
        const result = await toastPromise(serviceService.setActivateService(id, isActive), {
            loading: "Updating...",
            success: "Service activation updated!",
            error: "Failed to update service activation",
        });
        if (!result) {
            setData((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, isActive: !isActive }
                        : item
                )
            );
        }
    };

    const columns = getServiceColumns({
        onDelete: (s) => setModalState({ type: "DELETE", data: s }),
        onUpdate: (id) => setModalState({ type: "UPDATE", data: id }),
        onToggleActivate,
    });

    return (
        <div>
            <PageBreadcrumb pagePath="/service" pageTitle="Dịch vụ" />
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
                    name="Dịch vụ"
                    loading={loading}
                    pageSize={pageInfo?.pageSize ?? 0}
                />
                <AddServiceModal
                    isOpen={modal.type === "ADD"}
                    closeModal={closeModal}
                    reload={fetchData}
                />
                <UpdateServiceModal
                    isOpen={modal.type === "UPDATE"}
                    closeModal={closeModal}
                    serviceId={typeof modal.data === "number" ? modal.data : null}
                    reload={fetchData}
                />
                <DeleteServiceModal
                    isOpen={modal.type === "DELETE" && modal.data !== null && typeof modal.data !== "number"}
                    closeModal={closeModal}
                    service={modal.data as Service}
                    reload={fetchData}
                />
            </div>
        </div>
    );
}

export default ServicePage;