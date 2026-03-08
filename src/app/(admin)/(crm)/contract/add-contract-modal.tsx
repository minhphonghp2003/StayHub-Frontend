"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";

import ActionModal from "@/components/ui/modal/ActionModal";
import Input from "@/components/form/InputField";
import PriceInput from "@/components/form/PriceInput";
import { FormSelect } from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import { toastPromise } from "@/lib/alert-helper";
import { RootState } from "@/redux/store";
import { Unit } from "@/core/model/infra/unit";
import { Customer } from "@/core/model/crm/customer";
import { Service } from "@/core/model/infra/service";
import { Asset } from "@/core/model/infra/asset";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { AddContractPayload, ContractServicePayload, ContractAssetPayload } from "@/core/payload/crm/add-contract-payload";
import { contractService } from "@/core/service/crm/contract-service";
import { unitService } from "@/core/service/infra/unit-service";
import { customerService } from "@/core/service/crm/customer-service";
import { serviceService } from "@/core/service/infra/service-service";
import { assetService } from "@/core/service/infra/asset-service";
import { categoryItemService } from "@/core/service/catalog/category-item-service";

interface AddContractModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
}

type FormValues = {
    customerIds: string[];
    unitId: string;
    price: string;
    deposit: string;
    depositRemain?: string;
    depositRemainEndDate?: string;
    startDate: string;
    endDate: string;
    paymentPeriodId: string;
    note?: string;
    attachment?: string;
    isSigned: boolean;
    templateId?: string;
    representativeId: string;
    vehicleNumber?: string;
    saleId?: string;
    services?: { serviceId: string; quantity: string }[];
    assets?: { assetId: string; quantity: string }[];
};

function AddContractModal({ isOpen, closeModal, reload }: AddContractModalProps) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [units, setUnits] = useState<Unit[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [paymentPeriods, setPaymentPeriods] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [serviceRows, setServiceRows] = useState<{ serviceId: string; quantity: string }[]>([{ serviceId: "", quantity: "" }]);
    const [assetRows, setAssetRows] = useState<{ assetId: string; quantity: string }[]>([{ assetId: "", quantity: "" }]);
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
    const [representativeId, setRepresentativeId] = useState<number | null>(null);
    const [showCustomerList, setShowCustomerList] = useState(true);

    const form = useForm<FormValues>({
        defaultValues: {
            customerIds: [],
            unitId: "",
            price: "",
            deposit: "",
            depositRemain: "",
            depositRemainEndDate: "",
            startDate: "",
            endDate: "",
            paymentPeriodId: "",
            note: "",
            attachment: "",
            isSigned: false,
            templateId: "",
            representativeId: "",
            vehicleNumber: "",
            saleId: "",
        },
    });

    const fetchDropdowns = async () => {
        if (!selectedPropertyId) return;
        const [u, c, s, a, p] = await Promise.all([
            unitService.getAllUnitsNoPaging(selectedPropertyId) ?? Promise.resolve(null),
            customerService.getAllCustomersNoPaging(selectedPropertyId) ?? Promise.resolve(null),
            serviceService.getAllServices({ propertyId: selectedPropertyId, pageSize: 10000 }).then(r => r?.data ?? null),
            assetService.getAllAssetsNoPaging(selectedPropertyId) ?? Promise.resolve(null),
            categoryItemService.getCategoryItemsByCategoryCode("PAYMENT_PERIOD"),
        ]);
        setUnits(u ?? []);
        setCustomers(c ?? []);
        setServices(s ?? []);
        setAssets(a ?? []);
        setPaymentPeriods(p ?? []);
    };

    useEffect(() => {
        if (isOpen && selectedPropertyId) {
            fetchDropdowns();
        }
    }, [isOpen, selectedPropertyId]);

    const onSubmit = async (data: FormValues) => {
        if (selectedCustomers.length === 0) {
            await toastPromise(Promise.reject(new Error("Vui lòng chọn ít nhất một khách hàng")), {
                loading: "Đang xác nhận...",
                success: "Hoàn thành!",
                error: "Vui lòng chọn ít nhất một khách hàng",
            });
            return;
        }
        if (!representativeId) {
            await toastPromise(Promise.reject(new Error("Vui lòng chọn đại diện")), {
                loading: "Đang xác nhận...",
                success: "Hoàn thành!",
                error: "Vui lòng chọn đại diện cho hợp đồng",
            });
            return;
        }
        setLoading(true);
        const payload: AddContractPayload = {
            customerIds: selectedCustomers,
            unitId: parseInt(data.unitId),
            price: parseInt(data.price),
            deposit: parseInt(data.deposit),
            depositRemain: data.depositRemain ? parseInt(data.depositRemain) : undefined,
            depositRemainEndDate: data.depositRemainEndDate || undefined,
            startDate: data.startDate,
            endDate: data.endDate,
            paymentPeriodId: parseInt(data.paymentPeriodId),
            note: data.note || undefined,
            attachment: data.attachment || undefined,
            isSigned: data.isSigned || false,
            templateId: data.templateId ? parseInt(data.templateId) : undefined,
            representativeId: representativeId,
            vehicleNumber: data.vehicleNumber ? parseInt(data.vehicleNumber) : undefined,
            saleId: data.saleId ? parseInt(data.saleId) : undefined,
            services: serviceRows
                .filter(r => r.serviceId && r.quantity)
                .map(r => ({ serviceId: parseInt(r.serviceId), quantity: parseInt(r.quantity) })),
            assets: assetRows
                .filter(r => r.assetId && r.quantity)
                .map(r => ({ assetId: parseInt(r.assetId), quantity: parseInt(r.quantity) })),
        };

        const result = await toastPromise(contractService.createContract(payload), {
            loading: "Đang tạo hợp đồng...",
            success: "Hợp đồng đã được tạo!",
            error: "Tạo hợp đồng thất bại",
        });
        setLoading(false);
        if (result) {
            closeModal();
            reload();
            form.reset();
            setServiceRows([{ serviceId: "", quantity: "" }]);
            setAssetRows([{ assetId: "", quantity: "" }]);
            setSelectedCustomers([]);
            setRepresentativeId(null);
        }
    };

    return (
        <ActionModal
            isOpen={isOpen}
            closeModal={closeModal}
            heading="Thêm hợp đồng"
            onConfirm={form.handleSubmit(onSubmit)}
            loading={loading}
            size="2xl"
        >
            <div className="grid grid-cols-2 gap-12 max-h-[70vh] overflow-y-auto px-6">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                    {/* Section 1: Thông tin căn hộ & thời hạn */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Thông tin căn hộ & thời hạn</h3>
                        <div className="flex flex-col gap-2">
                            <FormSelect
                                name="unitId"
                                control={form.control}
                                label="Căn hộ"
                                options={units.map(u => ({ value: u.id?.toString(), label: u.name ?? "" }))}
                                placeholder="Chọn căn hộ"
                            />
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <Controller
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <DatePicker
                                        id="add-startDate"
                                        label="Ngày bắt đầu"
                                        placeholder="Chọn ngày bắt đầu"
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
                            <Controller
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <DatePicker
                                        id="add-endDate"
                                        label="Ngày kết thúc"
                                        placeholder="Chọn ngày kết thúc"
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
                    </div>

                    {/* Section 3: Thanh toán */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Thanh toán</h3>
                        <div className="flex flex-col gap-2">
                            <Controller
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <PriceInput
                                        label="Giá"
                                        value={field.value ? parseInt(field.value) : undefined}
                                        onChange={(val) => field.onChange(val.toString())}
                                        required
                                    />
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="deposit"
                                render={({ field }) => (
                                    <PriceInput
                                        label="Tiền cước"
                                        value={field.value ? parseInt(field.value) : undefined}
                                        onChange={(val) => field.onChange(val.toString())}
                                        required
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <Controller
                                control={form.control}
                                name="depositRemain"
                                render={({ field }) => (
                                    <PriceInput
                                        label="Tiền cược còn lại"
                                        value={field.value ? parseInt(field.value) : undefined}
                                        onChange={(val) => field.onChange(val.toString())}
                                    />
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="depositRemainEndDate"
                                render={({ field }) => (
                                    <DatePicker
                                        id="add-depositRemainEndDate"
                                        label="Hạn thanh toán cọc"
                                        placeholder="Chọn hạn thanh toán"
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
                        <div className="flex flex-col gap-2 mt-2">
                            <FormSelect
                                name="paymentPeriodId"
                                control={form.control}
                                label="Kỳ thanh toán"
                                options={paymentPeriods.map(p => ({ value: p.id?.toString(), label: p.name ?? "" }))}
                                placeholder="Chọn kỳ thanh toán"
                            />
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                    {/* Section 2: Thông tin khách thuê */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Thông tin khách thuê</h3>
                        <div className="space-y-2">
                            {customers.map((c, index) => (
                                <div key={c.id} className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 p-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomers.includes(c.id ?? 0)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        const newSelected = [...selectedCustomers, c.id ?? 0];
                                                        setSelectedCustomers(newSelected);
                                                        form.setValue("customerIds", newSelected.map(id => id.toString()));
                                                        // Set as representative if first added
                                                        if (newSelected.length === 1) {
                                                            setRepresentativeId(c.id ?? null);
                                                            form.setValue("representativeId", (c.id ?? 0).toString());
                                                        }
                                                    } else {
                                                        const filtered = selectedCustomers.filter(id => id !== c.id);
                                                        setSelectedCustomers(filtered);
                                                        form.setValue("customerIds", filtered.map(id => id.toString()));
                                                        // Clear representative if they were the one removed
                                                        if (representativeId === c.id) {
                                                            setRepresentativeId(null);
                                                            form.setValue("representativeId", "");
                                                        }
                                                    }
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="flex-1 text-sm font-medium">{c.name}</span>
                                        </div>
                                    </div>
                                    {selectedCustomers.includes(c.id ?? 0) && (
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={representativeId === c.id}
                                                onChange={() => {
                                                    if (representativeId === c.id) {
                                                        setRepresentativeId(null);
                                                        form.setValue("representativeId", "");
                                                    } else {
                                                        setRepresentativeId(c.id ?? null);
                                                        form.setValue("representativeId", (c.id ?? 0).toString());
                                                    }
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">Đại diện</span>
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => { }}
                            className="text-sm text-brand-500 hover:text-brand-600 mt-2 cursor-default"
                        >
                            {selectedCustomers.length > 0 ? `${selectedCustomers.length} khách hàng đã chọn` : "Chọn khách hàng"}
                        </button>
                    </div>

                    {/* Section 4: Dịch vụ */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Dịch vụ</h3>
                        <div className="space-y-2">
                            {serviceRows.map((row, index) => (
                                <div key={index} className="flex gap-2">
                                    <div className="flex-1">
                                        <FormSelect
                                            name={`services.${index}.serviceId`}
                                            control={form.control}
                                            options={services.map(s => ({ value: s.id?.toString(), label: s.name ?? "" }))}
                                            placeholder="Chọn dịch vụ"
                                        />
                                    </div>
                                    <Input
                                        placeholder="Số lượng"
                                        type="number"
                                        value={row.quantity}
                                        onChange={(e) => {
                                            const newRows = [...serviceRows];
                                            newRows[index].quantity = e.target.value;
                                            setServiceRows(newRows);
                                        }}
                                        className="w-24"
                                    />
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setServiceRows(serviceRows.filter((_, i) => i !== index))}
                                            className="px-2 py-1 text-red-500 hover:bg-red-50 rounded"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setServiceRows([...serviceRows, { serviceId: "", quantity: "" }])}
                            className="text-sm text-brand-500 hover:text-brand-600 mt-2"
                        >
                            + Thêm dịch vụ
                        </button>
                    </div>

                    {/* Section 5: Bàn giao tài sản */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Bàn giao tài sản</h3>
                        <div className="space-y-2">
                            {assetRows.map((row, index) => (
                                <div key={index} className="flex gap-2">
                                    <div className="flex-1">
                                        <FormSelect
                                            name={`assets.${index}.assetId`}
                                            control={form.control}
                                            options={assets.map(a => ({ value: a.id?.toString(), label: a.name ?? "" }))}
                                            placeholder="Chọn tài sản"
                                        />
                                    </div>
                                    <Input
                                        placeholder="Số lượng"
                                        type="number"
                                        value={row.quantity}
                                        onChange={(e) => {
                                            const newRows = [...assetRows];
                                            newRows[index].quantity = e.target.value;
                                            setAssetRows(newRows);
                                        }}
                                        className="w-24"
                                    />
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setAssetRows(assetRows.filter((_, i) => i !== index))}
                                            className="px-2 py-1 text-red-500 hover:bg-red-50 rounded"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setAssetRows([...assetRows, { assetId: "", quantity: "" }])}
                            className="text-sm text-brand-500 hover:text-brand-600 mt-2"
                        >
                            + Thêm tài sản
                        </button>
                    </div>

                    {/* Section 6: File & Ghi chú */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">File & Ghi chú</h3>
                        <div className="flex flex-col gap-2">
                            <Input {...form.register("attachment")} label="File đính kèm (URL)" />
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <Input {...form.register("note")} label="Ghi chú" />
                        </div>
                    </div>
                </div>
            </div>
        </ActionModal>
    );
}

export default AddContractModal;
