"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import ActionModal from "@/components/ui/modal/ActionModal";
import Input from "@/components/form/InputField";
import { FormSelect } from "@/components/form/Select";
import { categoryItemService } from "@/core/service/catalog/category-item-service";
import { addressService } from "@/core/service/address/address-service";
import { toastPromise } from "@/lib/alert-helper";
import { RootState } from "@/redux/store";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { Province, Ward } from "@/core/model/address/address";
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
    dateOfBirth?: string;
    address?: string;
    image?: string;
    job?: string;
};

function AddCustomerModal({ isOpen, closeModal, reload }: AddCustomerModalProps) {
    const [genders, setGenders] = useState<CategoryItem[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    // const [units, setUnits] = useState<Unit[]>([]);
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
            // unitId removed as it is no longer captured
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
        // Removed unit fetching logic as unitId is no longer used
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
                <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
                <div className="flex gap-2">
                    <Input {...form.register("name")} required label="Tên" />
                    <Input {...form.register("phone")} type="tel" required label="Số điện thoại" />
                </div>
                <div className="flex gap-2">
                    <Input {...form.register("email")} label="Email" />
                    <Input {...form.register("cccd")} label="CCCD" />
                </div>

                <div>
                    <div className="flex gap-2 mt-2">
                        <FormSelect
                            name="genderId"
                            control={form.control}
                            label="Giới tính"
                            options={genders.map(g => ({ value: g.id?.toString(), label: g.name ?? "" }))}
                            placeholder="Chọn giới tính"
                        />
                        <Input {...form.register("dateOfBirth")} type="date" label="Ngày sinh" />
                    </div>
                    <div className="flex gap-2">
                        <Input {...form.register("job")} label="Công việc" />
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-lg">Thông tin địa chỉ</h3>
                    <div className="flex gap-2 mt-2">
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
                    <div className="mt-2">
                        <Input {...form.register("address")} label="Địa chỉ" />
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-lg">Khác</h3>
                    <div className="mt-2">
                        <Input {...form.register("image")} label="Hình ảnh (URL)" />
                    </div>
                </div>
            </div>
        </ActionModal>

    );
}

export default AddCustomerModal;