"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useSelector } from "react-redux";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/table/data-table";
import { RootState } from "@/redux/store";
import { PageInfo } from "@/core/model/BaseResponse";
import { Asset } from "@/core/model/infra/asset";
import { assetService } from "@/core/service/infra/asset-service";
import { toastPromise } from "@/lib/alert-helper";
import { getAssetColumns } from "@/app/(admin)/(infra)/asset/asset-columns";
import AddAssetModal from "@/app/(admin)/(infra)/asset/add-asset-modal";
import DeleteAssetModal from "@/app/(admin)/(infra)/asset/delete-asset-modal";
import UpdateAssetModal from "@/app/(admin)/(infra)/asset/update-asset-modal";
type ModalState = {
  type: "ADD" | "UPDATE" | "DELETE" | null;
  data: Asset | null;
};

function AssetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const page = searchParams.get("page");

  const selectedPropertyId = useSelector(
    (state: RootState) => state.property.selectedPropertyId
  );

  const [modal, setModalState] = useState<ModalState>({ type: null, data: null });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Asset[]>([]);
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
    const result = await assetService.getAllAssets({
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

  const columns = getAssetColumns({
    onDelete: (a) => setModalState({ type: "DELETE", data: a }),
    onUpdate: (a) => setModalState({ type: "UPDATE", data: a }),
  });

  return (
    <div>
      <PageBreadcrumb pagePath="/asset" pageTitle="Tài sản" />
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
          loading={loading} pageSize={0} name={"Tài sản"} />
        {modal.type === "ADD" && <AddAssetModal isOpen={modal.type === "ADD"} onClose={closeModal} onSuccess={fetchData} />}
        {modal.type === "UPDATE" && modal.data && (
          <UpdateAssetModal isOpen={modal.type === "UPDATE"} assetId={modal.data.id ?? 0} onClose={closeModal} onSuccess={fetchData} />
        )}
        {modal.type === "DELETE" && modal.data && (
          <DeleteAssetModal isOpen={modal.type === "DELETE"} asset={modal.data} onClose={closeModal} onSuccess={fetchData} />
        )}
      </div>
    </div>
  );
}

export default AssetPage;
