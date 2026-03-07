"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useSelector } from "react-redux";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/table/data-table";
import { RootState } from "@/redux/store";
import { PageInfo } from "@/core/model/BaseResponse";
import { Job } from "@/core/model/infra/job";
import { jobService } from "@/core/service/infra/job-service";
import { toastPromise } from "@/lib/alert-helper";
import AddJobModal from "@/app/(admin)/(infra)/job/add-job-modal";
import DeleteJobModal from "@/app/(admin)/(infra)/job/delete-job-modal";
import { getJobColumns } from "@/app/(admin)/(infra)/job/job-columns";
import UpdateJobModal from "@/app/(admin)/(infra)/job/update-job-modal";

type ModalState = {
  type: "ADD" | "UPDATE" | "DELETE" | null;
  data: Job | null;
};

function JobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const page = searchParams.get("page");

  const selectedPropertyId = useSelector(
    (state: RootState) => state.property.selectedPropertyId
  );

  const [modal, setModalState] = useState<ModalState>({ type: null, data: null });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Job[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  useEffect(() => {
    fetchData();
  }, [page, search, selectedPropertyId]);

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
    const result = await jobService.getAllJobs({
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

  const onToggleActive = async (job: Job, isActive: boolean) => {
    setData(prev =>
      prev.map(item =>
        item.id === job.id ? { ...item, isActive } : item
      )
    );
    const result = await toastPromise(jobService.setActivation(job.id ?? 0, isActive), {
      loading: "Đang cập nhật trạng thái công việc...",
      success: "Trạng thái công việc đã được cập nhật!",
      error: "Cập nhật trạng thái công việc thất bại",
    });
    if (!result) {
      setData(prev =>
        prev.map(item =>
          item.id === job.id ? { ...item, isActive: !isActive } : item
        )
      );
    }
  };

  const columns = getJobColumns({
    onDelete: (j) => setModalState({ type: "DELETE", data: j }),
    onUpdate: (j) => setModalState({ type: "UPDATE", data: j }),
    onToggleActive,
  });

  return (
    <div>
      <PageBreadcrumb pagePath="/job" pageTitle="Công việc" />
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
          loading={loading} pageSize={0} name={"Công việc"} />
        {modal.type === "ADD" && <AddJobModal isOpen={modal.type === "ADD"} onClose={closeModal} onSuccess={fetchData} />}
        {modal.type === "UPDATE" && modal.data && (
          <UpdateJobModal isOpen={modal.type === "UPDATE"} jobId={modal.data.id ?? 0} onClose={closeModal} onSuccess={fetchData} />
        )}
        {modal.type === "DELETE" && modal.data && (
          <DeleteJobModal isOpen={modal.type === "DELETE"} onClose={closeModal} onSuccess={fetchData} job={modal.data as Job} />
        )}
      </div>
    </div>
  );
}

export default JobPage;