"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";

import ActionModal from "@/components/ui/modal/ActionModal";
import Input from "@/components/form/InputField";
import { FormSelect } from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import { categoryItemService } from "@/core/service/catalog/category-item-service";
import { addressService } from "@/core/service/address/address-service";
import { toastPromise } from "@/lib/alert-helper";
import { RootState } from "@/redux/store";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { Province, Ward } from "@/core/model/address/address";
import { Customer } from "@/core/model/crm/customer";
import { UpdateCustomerPayload } from "@/core/payload/crm/update-customer-payload";
import { customerService } from "@/core/service/crm/customer-service";
import { Spinner } from "@/components/ui/shadcn/spinner";

interface UpdateCustomerModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
    customerId: number | null;
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

function UpdateCustomerModal({
    isOpen,
    closeModal,
    reload,
    customerId,
}: UpdateCustomerModalProps) {
    const [genders, setGenders] = useState<CategoryItem[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    // unit selection removed
    const [isLoading, setIsLoading] = useState(true);

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
        // no longer fetching units
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

    useEffect(() => {
        if (isOpen && customerId) {
            setIsLoading(true);
            customerService.getCustomerById(customerId).then(c => {
                if (c) {
                    form.reset({
                        name: c.name,
                        phone: c.phone,
                        email: c.email || "",
                        cccd: c.cccd || "",
                        genderId: c.genderId?.toString() ?? "",
                        provinceId: c.provinceId?.toString() ?? "",
                        wardId: c.wardId?.toString() ?? "",
                        dateOfBirth: c.dateOfBirth ? c.dateOfBirth.split("T")[0] : "",
                        address: c.address || "",
                        image: c.image || "",
                        job: c.job || "",
                    });
                }
                setIsLoading(false);
            });
        }
    }, [isOpen, customerId]);

    const onSubmit = async (data: FormValues) => {
        if (!selectedPropertyId || !customerId) return;
        setIsLoading(true);
        const payload: UpdateCustomerPayload = {
            name: data.name,
            phone: data.phone,
            propertyId: selectedPropertyId,
            email: data.email || undefined,
            cccd: data.cccd || undefined,
            genderId: data.genderId ? parseInt(data.genderId) : undefined,
            provinceId: data.provinceId ? parseInt(data.provinceId) : undefined,
            wardId: data.wardId ? parseInt(data.wardId) : undefined,
            // unitId removed
            dateOfBirth: data.dateOfBirth || undefined,
            address: data.address || undefined,
            image: data.image || undefined,
            job: data.job || undefined,
        };

        const result = await toastPromise(customerService.updateCustomer(customerId, payload), {
            loading: "Đang cập nhật khách hàng...",
            success: "Khách hàng đã được cập nhật!",
            error: "Cập nhật khách hàng thất bại",
        });
        setIsLoading(false);
        if (result) {
            closeModal();
            reload();
        }
    };

    return (
        <ActionModal
            isOpen={isOpen}
            closeModal={closeModal}
            heading="Cập nhật khách hàng"
            onConfirm={form.handleSubmit(onSubmit)}
            loading={isLoading}
        >
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md transition-all duration-200">
                        <div className="flex flex-col items-center gap-2">
                            <Spinner className="size-14 text-brand-300" />
                            <span className="text-sm text-muted-foreground">Đang tải dữ liệu...</span>
                        </div>
                    </div>
                )}
                <div className={`flex flex-col gap-4 ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
                    <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
                    <div className="flex gap-2">
                        <Input {...form.register("name")} required label="Tên" />
                        <Input {...form.register("phone")} required label="Số điện thoại" />
                    </div>
                    <div className="flex gap-2">
                        <Input {...form.register("email")} label="Email" />
                        <Input {...form.register("cccd")} label="CCCD" />
                    </div>

                    <div>
                        <div className="flex gap-2 mt-2">
                            {genders.length > 0 && <FormSelect
                                name="genderId"
                                control={form.control}
                                label="Giới tính"
                                options={genders.map(g => ({ value: g.id?.toString(), label: g.name ?? "" }))}
                                placeholder="Chọn giới tính"
                            />
                            }
                            <Controller
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <DatePicker
                                        id="update-dateOfBirth"
                                        label="Ngày sinh"
                                        placeholder="Chọn ngày sinh"
                                        defaultDate={field.value}
                                        onChange={(selectedDates) => {
                                            if (selectedDates[0]) {
                                                const date = new Date(selectedDates[0]);
                                                const formatted = date.toISOString();
                                                field.onChange(formatted);
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Input {...form.register("job")} label="Công việc" />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg">Thông tin địa chỉ</h3>
                        <div className="flex gap-2 mt-2">
                            {provinces.length > 0 && <FormSelect
                                name="provinceId"
                                control={form.control}
                                label="Tỉnh/Thành"
                                options={provinces.map(p => ({ value: p.id?.toString(), label: p.name ?? "" }))}
                                placeholder="Chọn tỉnh"
                            />
                            }
                            {wards.length > 0 && <FormSelect
                                name="wardId"
                                control={form.control}
                                label="Phường/Xã"
                                options={wards.map(w => ({ value: w.id?.toString(), label: w.name ?? "" }))}
                                placeholder="Chọn phường"
                            />
                            }
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
            </div>
        </ActionModal>
    );
}

export default UpdateCustomerModal;