"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useSelector } from "react-redux";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/table/data-table";
import { RootState } from "@/redux/store";
import { PageInfo } from "@/core/model/BaseResponse";
import {
    UnitGroup
} from "@/core/model/infra/unitGroup";
import { unitGroupService } from "@/core/service/infra/unitGroup-service";
import AddUnitGroupModal from "./add-unitGroup-modal";
import UpdateUnitGroupModal from "./update-unitGroup-modal";
import DeleteUnitGroupModal from "./delete-unitGroup-modal";
import { getUnitGroupColumns } from "./unitGroup-columns";

type ModalState = {
    type: "ADD" | "UPDATE" | "DELETE" | null;
    data: UnitGroup | null;
};

function UnitGroupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    const page = searchParams.get("page");

    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [modal, setModalState] = useState<ModalState>({ type: null, data: null });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<UnitGroup[]>([]);
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
        const result = await unitGroupService.getAllUnitGroups({
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

    const columns = getUnitGroupColumns({
        onDelete: (ug) => setModalState({ type: "DELETE", data: ug }),
        onUpdate: (ug) => setModalState({ type: "UPDATE", data: ug }),
    });

    return (
        <div>
            <PageBreadcrumb pagePath="/unitGroup" pageTitle="Khu/tầng/dãy" />
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
                    name="Khu/tầng/dãy"
                    loading={loading}
                    pageSize={pageInfo?.pageSize ?? 0}
                />
                <AddUnitGroupModal
                    isOpen={modal.type === "ADD"}
                    closeModal={closeModal}
                    reload={fetchData}
                />
                <UpdateUnitGroupModal
                    isOpen={modal.type === "UPDATE" && modal.data !== null}
                    closeModal={closeModal}
                    unitGroup={modal.data}
                    reload={fetchData}
                />
                <DeleteUnitGroupModal
                    isOpen={modal.type === "DELETE" && modal.data !== null}
                    closeModal={closeModal}
                    unitGroup={modal.data}
                    reload={fetchData}
                />
            </div>
        </div>
    );
}

export default UnitGroupPage;