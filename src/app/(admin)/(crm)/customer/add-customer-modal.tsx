"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";

import ActionModal from "@/components/ui/modal/ActionModal";
import Input from "@/components/form/InputField";
import { FormSelect } from "@/components/form/Select";
import { categoryItemService } from "@/core/service/catalog/category-item-service";
import { addressService } from "@/core/service/address/address-service";
import { unitService } from "@/core/service/infra/unit-service";
import { toastPromise } from "@/lib/alert-helper";
import { RootState } from "@/redux/store";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { Province, Ward } from "@/core/model/address/address";
import { Unit } from "@/core/model/infra/unit";
import { AddCustomerPayload } from "@/core/payload/crm/add-customer-payload";
import { customerService } from "@/core/service/crm/customer-service";

interface AddCustomerModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
}

type FormValues = {
    name: string;
    phone: string;
    email?: string;
    cccd?: string;
    genderId?: string;
    provinceId?: string;
    wardId?: string;
    unitId?: string;
    dateOfBirth?: string;
    address?: string;
    image?: string;
    job?: string;
};

function AddCustomerModal({ isOpen, closeModal, reload }: AddCustomerModalProps) {
    const [genders, setGenders] = useState<CategoryItem[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);

    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            cccd: "",
            genderId: undefined,
            provinceId: undefined,
            wardId: undefined,
            unitId: undefined,
            dateOfBirth: "",
            address: "",
            image: "",
            job: "",
        },
    });

    const fetchDropdowns = async () => {
        const [g, p] = await Promise.all([
            categoryItemService.getCategoryItemsByCategoryCode("GENDER"),
            addressService.getAllProvinces(),
        ]);
        setGenders(g ?? []);
        setProvinces(p ?? []);
        if (selectedPropertyId) {
            const u = await unitService.getAllUnitsNoPaging(selectedPropertyId);
            setUnits(u ?? []);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDropdowns();
        }
    }, [isOpen]);

    useEffect(() => {
        const provId = form.watch("provinceId");
        if (provId) {
            addressService.getAllWardsByProvince(parseInt(provId)).then(w => setWards(w ?? []));
        } else {
            setWards([]);
        }
    }, [form.watch("provinceId")]);

    const onSubmit = async (data: FormValues) => {
        if (!selectedPropertyId) return;
        setLoading(true);
        const payload: AddCustomerPayload = {
            name: data.name,
            phone: data.phone,
            propertyId: selectedPropertyId,
            email: data.email || undefined,
            cccd: data.cccd || undefined,
            genderId: data.genderId ? parseInt(data.genderId) : undefined,
            provinceId: data.provinceId ? parseInt(data.provinceId) : undefined,
            wardId: data.wardId ? parseInt(data.wardId) : undefined,
            unitId: data.unitId ? parseInt(data.unitId) : undefined,
            dateOfBirth: data.dateOfBirth || undefined,
            address: data.address || undefined,
            image: data.image || undefined,
            job: data.job || undefined,
        };

        const result = await toastPromise(customerService.createCustomer(payload), {
            loading: "Đang tạo khách hàng...",
            success: "Khách hàng đã được tạo!",
            error: "Tạo khách hàng thất bại",
        });
        setLoading(false);
        if (result) {
            closeModal();
            reload();
            form.reset();
        }
    };

    return (
        <ActionModal
            isOpen={isOpen}
            closeModal={closeModal}
            heading="Thêm khách hàng"
            onConfirm={form.handleSubmit(onSubmit)}
            loading={loading}
        >
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input {...form.register("name")} required label="Tên" />
                    <Input {...form.register("phone")} required label="Số điện thoại" />
                </div>
                <div className="flex gap-2">
                    <Input {...form.register("email")} label="Email" />
                    <Input {...form.register("cccd")} label="CCCD" />
                </div>
                <div className="flex gap-2">
                    <FormSelect
                        name="genderId"
                        control={form.control}
                        label="Giới tính"
                        options={genders.map(g => ({ value: g.id?.toString(), label: g.name ?? "" }))}
                        placeholder="Chọn giới tính"
                    />
                    <FormSelect
                        name="unitId"
                        control={form.control}
                        label="Phòng (tùy chọn)"
                        options={units.map(u => ({ value: u.id?.toString(), label: u.name ?? "" }))}
                        placeholder="Chọn phòng"
                    />
                </div>
                <div className="flex gap-2">
                    <FormSelect
                        name="provinceId"
                        control={form.control}
                        label="Tỉnh/Thành"
                        options={provinces.map(p => ({ value: p.id?.toString(), label: p.name ?? "" }))}
                        placeholder="Chọn tỉnh"
                    />
                    <FormSelect
                        name="wardId"
                        control={form.control}
                        label="Phường/Xã"
                        options={wards.map(w => ({ value: w.id?.toString(), label: w.name ?? "" }))}
                        placeholder="Chọn phường"
                    />
                </div>
                <div className="flex gap-2">
                    <Input {...form.register("dateOfBirth")} type="date" label="Ngày sinh" />
                    <Input {...form.register("job")} label="Công việc" />
                </div>
                <Input {...form.register("address")} label="Địa chỉ" />
                <Input {...form.register("image")} label="Hình ảnh (URL)" />
            </div>
        </ActionModal>
    );
}

export default AddCustomerModal;