import { Job } from "@/core/model/infra/job";
import { AddJobPayload } from "@/core/payload/infra/add-job-payload";
import { UpdateJobPayload } from "@/core/payload/infra/update-job-payload";
import { jobRepository } from "@/core/repository/infra/job-repository";

const getAllJobs = async ({
    propertyId,
    pageNumber,
    pageSize,
    search,
}: {
    propertyId: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<{ data: Job[]; pageInfo: PageInfo } | null> => {
    const result = await jobRepository.getAllJobs({
        propertyId,
        pageNumber,
        pageSize,
        search,
    });
    if (result.success) {
        return {
            data: result.data ?? [],
            pageInfo: result ?? null,
        };
    }
    return null;
};

const getJobById = async (id: number): Promise<Job | null> => {
    const result = await jobRepository.getJobById(id);
    return result.success ? result.data ?? null : null;
};

const createJob = async (payload: AddJobPayload): Promise<Job | null> => {
    const result = await jobRepository.createJob(payload);
    return result.success ? result.data ?? null : null;
};

const updateJob = async (id: number, payload: UpdateJobPayload): Promise<Job | null> => {
    const result = await jobRepository.updateJob(id, payload);
    return result.success ? result.data ?? null : null;
};

const deleteJob = async (id: number): Promise<boolean> => {
    const result = await jobRepository.deleteJob(id);
    return result.data ?? false;
};

const setActivation = async (id: number, isActivate: boolean): Promise<boolean> => {
    const result = await jobRepository.setActivation(id, isActivate);
    return result.data ?? false;
};

export const jobService = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    setActivation,
};
