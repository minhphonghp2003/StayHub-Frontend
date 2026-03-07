"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useSelector } from "react-redux";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/table/data-table";
import { RootState } from "@/redux/store";
import { Unit } from "@/core/model/infra/unit";
import { unitService } from "@/core/service/infra/unit-service";
import { toastPromise } from "@/lib/alert-helper";
import AddUnitModal from "@/app/(admin)/(infra)/unit/add-unit-modal";
import DeleteUnitModal from "@/app/(admin)/(infra)/unit/delete-unit-modal";
import { getUnitColumns } from "@/app/(admin)/(infra)/unit/unit-columns";
import UpdateUnitModal from "@/app/(admin)/(infra)/unit/update-unit-modal";

type ModalState = {
    type: "ADD" | "UPDATE" | "DELETE" | null;
    data: Unit | null;
};

function UnitPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    const page = searchParams.get("page");

    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [modal, setModalState] = useState<ModalState>({ type: null, data: null });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Unit[]>([]);
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
        const result = await unitService.getAllUnits({
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

    const handleToggleActive = async (unit: Unit, isActivate: boolean) => {
        setData((prev) =>
            prev.map((item) =>
                item.id === unit.id
                    ? { ...item, isActive: isActivate }
                    : item
            )
        );
        const result = await toastPromise(
            unitService.setActivation(unit.id ?? 0, isActivate),
            {
                loading: "Đang cập nhật trạng thái phòng...",
                success: "Cập nhật trạng thái phòng thành công!",
                error: "Cập nhật trạng thái phòng thất bại",
            }
        );
        if (!result) {
            setData((prev) =>
                prev.map((item) =>
                    item.id === unit.id
                        ? { ...item, isActive: !isActivate }
                        : item
                )
            );
        }
    };

    const columns = getUnitColumns({
        onDelete: (u) => setModalState({ type: "DELETE", data: u }),
        onUpdate: (u) => setModalState({ type: "UPDATE", data: u }),
        onToggleActive: handleToggleActive,
    });

    return (
        <div>
            <PageBreadcrumb pagePath="/unit" pageTitle="Phòng" />
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
                    name="Phòng"
                    loading={loading}
                    pageSize={pageInfo?.pageSize ?? 0}
                />
                <AddUnitModal
                    isOpen={modal.type === "ADD"}
                    closeModal={closeModal}
                    reload={fetchData}
                />
                <UpdateUnitModal
                    isOpen={modal.type === "UPDATE" && modal.data !== null}
                    closeModal={closeModal}
                    unit={modal.data}
                    reload={fetchData}
                />
                <DeleteUnitModal
                    isOpen={modal.type === "DELETE" && modal.data !== null}
                    closeModal={closeModal}
                    unit={modal.data}
                    reload={fetchData}
                />
            </div>
        </div>
    );
}

export default UnitPage;