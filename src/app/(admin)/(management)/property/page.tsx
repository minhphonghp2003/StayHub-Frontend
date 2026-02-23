"use client";
import AddPropertyModal from "@/app/(admin)/(management)/property/add-property-modal";
import DeletePropertyModal from "@/app/(admin)/(management)/property/delete-property-modal";
import { getPropertyColumns } from "@/app/(admin)/(management)/property/property-columns";
import UpdatePropertyModal from "@/app/(admin)/(management)/property/update-property-modal";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/table/data-table";
import { Property } from "@/core/model/pmm/property";
import { categoryItemService } from "@/core/service/catalog/category-item-service";
import { propertyService } from "@/core/service/pmm/property-service";
import { tierService } from "@/core/service/tier/tier-service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type ModalState = {
  type: "ADD" | "UPDATE" | "DELETE" | null;
  data: Property | null;
};

function PropertyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const page = searchParams.get("page");

  const [modal, setModalState] = useState<ModalState>({ type: null, data: null });
  const [loading, setLoading] = useState(true);
  const [propertyData, setPropertyData] = useState<Property[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [subscriptionStatuses, setSubscriptionStatuses] = useState<any[]>([]);

  useEffect(() => {
    fetchInitialData();
    fetchData();
  }, [page, search]);

  const fetchInitialData = async () => {
    try {
      // Fetch tiers
      const tiersResult = await tierService.getAllTiers();
      setTiers(tiersResult ?? []);

      const categoriesResult = await categoryItemService.getCategoryItemsByCategoryCode(
        "PROPERTY_TYPE"
      );
      setPropertyTypes(categoriesResult ?? []);

      const subscriptionStatusesResult = await categoryItemService.getCategoryItemsByCategoryCode(
        "SUBSCRIPTION_STATUS"
      );
      setSubscriptionStatuses(subscriptionStatusesResult ?? []);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setPropertyData([]);
    const result = await propertyService.getAllProperties({
      pageNumber: page,
      search,
    });
    setPropertyData(result?.data ?? []);
    setPageInfo(result?.pageInfo ?? null);
    setLoading(false);
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
  };

  const onChangePage = useDebouncedCallback((page) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`?${currentParams.toString()}`);
  }, 500);

  const onSearch = useDebouncedCallback((value) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("search", value);
    router.push(`?${currentParams.toString()}`);
  }, 1000);

  const columns = getPropertyColumns({
    onDelete: (property) => setModalState({ type: "DELETE", data: property }),
    onUpdate: (property) => setModalState({ type: "UPDATE", data: property }),
  });

  return (
    <div>
      <PageBreadcrumb pagePath="/property" pageTitle="Nhà" />
      <DataTable
        search={search}
        columns={columns}
        data={propertyData}
        onAddClicked={() => setModalState({ type: "ADD", data: null })}
        onSearch={onSearch}
        currentPage={pageInfo?.currentPage ?? 1}
        totalPage={pageInfo?.totalPages ?? 1}
        totalItems={pageInfo?.totalCount ?? 0}
        onPageChange={onChangePage}
        name="Danh sách nhà"
        loading={loading}
        pageSize={pageInfo?.pageSize ?? 0}
      />
      <AddPropertyModal
        isOpen={modal.type === "ADD"}
        closeModal={closeModal}
        reload={fetchData}
        tiers={tiers}
        propertyTypes={propertyTypes}
        subscriptionStatuses={subscriptionStatuses}
      />
      <UpdatePropertyModal
        isOpen={modal.type === "UPDATE" && modal.data !== null}
        closeModal={closeModal}
        property={modal.data}
        reload={fetchData}
        propertyTypes={propertyTypes}
      />
      <DeletePropertyModal
        isOpen={modal.type === "DELETE" && modal.data !== null}
        closeModal={closeModal}
        property={modal.data}
        reload={fetchData}
      />
    </div>
  );
}

export default PropertyPage;