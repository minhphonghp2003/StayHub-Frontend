import { api } from "@/core/http-client/AxiosClient";
import { Job } from "@/core/model/infra/job";
import { AddJobPayload } from "@/core/payload/infra/add-job-payload";
import { UpdateJobPayload } from "@/core/payload/infra/update-job-payload";

const baseUrl: string = "/job";

const getAllJobs = async (queryParam: {
    propertyId?: number;
    pageNumber?: number;
    pageSize?: number;
    search?: string;
}): Promise<BaseResponse<Job[]>> => {
    queryParam.search = queryParam.search?.trim() || undefined;
    const propertyId = queryParam.propertyId;
    delete queryParam.propertyId;
    const response = await api.get(`${baseUrl}/all/${propertyId}`, { params: queryParam });
    return response.data;
};

const getJobById = async (id: number): Promise<BaseResponse<Job | null>> => {
    const response = await api.get(`${baseUrl}/${id}`);
    return response.data;
};

const createJob = async (request: AddJobPayload): Promise<BaseResponse<Job>> => {
    const response = await api.post(`${baseUrl}`, request);
    return response.data;
};

const updateJob = async (id: number, request: UpdateJobPayload): Promise<BaseResponse<Job>> => {
    const response = await api.put(`${baseUrl}/${id}`, request);
    return response.data;
};

const deleteJob = async (id: number): Promise<BaseResponse<boolean>> => {
    const response = await api.delete(`${baseUrl}/${id}`);
    return response.data;
};

const setActivation = async (id: number, isActivate: boolean): Promise<BaseResponse<boolean>> => {
    const response = await api.patch(`${baseUrl}/activate/${id}`, null, { params: { isActivate } });
    return response.data;
};

export const jobRepository = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    setActivation,
};
