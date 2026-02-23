import { Province, Ward } from "@/core/model/address/address";
import { AddProvincePayload } from "@/core/payload/address/add-province-payload";
import { AddWardPayload } from "@/core/payload/address/add-ward-payload";
import { UpdateProvincePayload } from "@/core/payload/address/update-province-payload";
import { UpdateWardPayload } from "@/core/payload/address/update-ward-payload";
import { addressRepository } from "@/core/repository/address/address-repository";

// Province service
const getAllProvinces = async (): Promise<Province[] | null> => {
    const result = await addressRepository.getAllProvinces();
    if (result.success) {
        return result.data ?? [];
    }
    return null;
};

const getProvinceById = async (id: number): Promise<Province | null> => {
    const result = await addressRepository.getProvinceById(id);
    return result.success ? (result.data ?? null) : null;
};

const createProvince = async (payload: AddProvincePayload): Promise<Province | null> => {
    const result = await addressRepository.createProvince(payload);
    return result.success ? (result.data ?? null) : null;
};

const updateProvince = async (id: number, payload: UpdateProvincePayload): Promise<Province | null> => {
    const result = await addressRepository.updateProvince(id, payload);
    return result.success ? (result.data ?? null) : null;
};

const deleteProvince = async (id: number): Promise<boolean> => {
    const result = await addressRepository.deleteProvince(id);
    return result.data ?? false;
};

// Ward service
const getAllWards = async (): Promise<Ward[] | null> => {
    const result = await addressRepository.getAllWards();
    if (result.success) {
        return result.data ?? [];
    }
    return null;
};

const getAllWardsByProvince = async (provinceId: number): Promise<Ward[] | null> => {
    const result = await addressRepository.getAllWardsByProvince(provinceId);
    if (result.success) {
        return result.data ?? [];
    }
    return null;
};

const getWardById = async (id: number): Promise<Ward | null> => {
    const result = await addressRepository.getWardById(id);
    return result.success ? (result.data ?? null) : null;
};

const createWard = async (payload: AddWardPayload): Promise<Ward | null> => {
    const result = await addressRepository.createWard(payload);
    return result.success ? (result.data ?? null) : null;
};

const updateWard = async (id: number, payload: UpdateWardPayload): Promise<Ward | null> => {
    const result = await addressRepository.updateWard(id, payload);
    return result.success ? (result.data ?? null) : null;
};

const deleteWard = async (id: number): Promise<boolean> => {
    const result = await addressRepository.deleteWard(id);
    return result.data ?? false;
};

export const addressService = {
    // Province
    getAllProvinces,
    getProvinceById,
    createProvince,
    updateProvince,
    deleteProvince,
    // Ward
    getAllWards,
    getAllWardsByProvince,
    getWardById,
    createWard,
    updateWard,
    deleteWard,
};
