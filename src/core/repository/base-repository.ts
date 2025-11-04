import { AxiosInstance, AxiosResponse } from 'axios';
import { api } from '../http-client/axios-client';

export class BaseRepository<T,R> {
    protected endpoint: string;
    protected client: AxiosInstance;

    constructor(endpoint: string = "", client: AxiosInstance = api) {
        this.endpoint = endpoint;
        this.client = client;
    }

    async getAll(params?: Record<string, any>): Promise<T[]> {
        const res: AxiosResponse<T[]> = await this.client.get(this.endpoint, { params });
        return res.data;
    }

    async getById(id: string | number): Promise<T> {
        const res: AxiosResponse<T> = await this.client.get(`${this.endpoint}/${id}`);
        return res.data;
    }

    async create(data: Partial<T>): Promise<T> {
        const res: AxiosResponse<T> = await this.client.post(this.endpoint, data);
        return res.data;
    }

    async update(id: string | number, data: Partial<T>): Promise<T> {
        const res: AxiosResponse<T> = await this.client.put(`${this.endpoint}/${id}`, data);
        return res.data;
    }

    async delete(id: string | number): Promise<void> {
        await this.client.delete(`${this.endpoint}/${id}`);
    }
}
