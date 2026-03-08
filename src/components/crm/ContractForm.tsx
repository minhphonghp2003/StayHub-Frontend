"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import Input from "@/components/form/InputField";
import PriceInput from "@/components/form/PriceInput";
import { FormSelect } from "@/components/form/Select";
import Switch from "@/components/form/Switch";
import DatePicker from "@/components/form/date-picker";
import { Unit } from "@/core/model/infra/unit";
import { Customer } from "@/core/model/crm/customer";
import { Service } from "@/core/model/infra/service";
import { Asset } from "@/core/model/infra/asset";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { User } from "@/core/model/RBAC/User";
import { TrashBinIcon } from "@/icons";

export type ContractFormValues = {
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

interface ContractFormProps {
    form: UseFormReturn<ContractFormValues>;
    units: Unit[];
    customers: Customer[];
    services: Service[];
    assets: Asset[];
    paymentPeriods: CategoryItem[];
    sales: User[];
    customerRows: { customerId: string; isRepresentative: boolean }[];
    serviceRows: { serviceId: string; quantity: string }[];
    assetRows: { assetId: string; quantity: string }[];
    onCustomerRowsChange: (rows: { customerId: string; isRepresentative: boolean }[]) => void;
    onServiceRowsChange: (rows: { serviceId: string; quantity: string }[]) => void;
    onAssetRowsChange: (rows: { assetId: string; quantity: string }[]) => void;
}

export function ContractForm({
    form,
    units,
    customers,
    services,
    assets,
    paymentPeriods,
    sales,
    customerRows,
    serviceRows,
    assetRows,
    onCustomerRowsChange,
    onServiceRowsChange,
    onAssetRowsChange,
}: ContractFormProps) {
    const handleCustomerChange = (index: number, value: string) => {
        const newRows = [...customerRows];
        newRows[index].customerId = value as string;
        onCustomerRowsChange(newRows);
        const customerIds = newRows.filter(r => r.customerId).map(r => r.customerId);
        form.setValue("customerIds", customerIds);
        const representative = newRows.find(r => r.isRepresentative);
        if (representative?.customerId) {
            form.setValue("representativeId", representative.customerId);
        }
    };

    const handleCustomerRepresentativeChange = (index: number, checked: boolean) => {
        const newRows = [...customerRows];
        if (checked) {
            newRows.forEach((r, i) => {
                r.isRepresentative = i === index;
            });
            if (customerRows[index].customerId) {
                form.setValue("representativeId", customerRows[index].customerId);
            }
        } else {
            newRows[index].isRepresentative = false;
            form.setValue("representativeId", "");
        }
        onCustomerRowsChange(newRows);
    };

    const handleDeleteCustomer = (index: number) => {
        onCustomerRowsChange(customerRows.filter((_, i) => i !== index));
    };

    const handleAddCustomer = () => {
        onCustomerRowsChange([...customerRows, { customerId: "", isRepresentative: false }]);
    };

    const handleServiceChange = (index: number, quantity: string) => {
        const newRows = [...serviceRows];
        newRows[index].quantity = quantity;
        onServiceRowsChange(newRows);
    };

    const handleDeleteService = (index: number) => {
        onServiceRowsChange(serviceRows.filter((_, i) => i !== index));
    };

    const handleAddService = () => {
        onServiceRowsChange([...serviceRows, { serviceId: "", quantity: "" }]);
    };

    const handleAssetChange = (index: number, quantity: string) => {
        const newRows = [...assetRows];
        newRows[index].quantity = quantity;
        onAssetRowsChange(newRows);
    };

    const handleDeleteAsset = (index: number) => {
        onAssetRowsChange(assetRows.filter((_, i) => i !== index));
    };

    const handleAddAsset = () => {
        onAssetRowsChange([...assetRows, { assetId: "", quantity: "" }]);
    };

    return (
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
                            required
                            label="Căn hộ"
                            options={units.map(u => ({ value: u.id?.toString(), label: u.name ?? "" }))}
                            placeholder="Chọn căn hộ"
                        />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Controller
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <DatePicker
                                    id="startDate"
                                    label="Ngày bắt đầu"
                                    required
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
                                    id="endDate"
                                    label="Ngày kết thúc"
                                    placeholder="Chọn ngày kết thúc"
                                    required
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
                            name="saleId"
                            control={form.control}
                            label="Người dẫn khách"
                            options={sales.map(s => ({ value: s.id?.toString(), label: s.fullname ?? "" }))}
                            placeholder="Người dẫn khách"
                        />
                    </div>
                </div>

                {/* Section 3: Thanh toán */}
                <div>
                    <h3 className="font-semibold text-lg mb-3">Thanh toán</h3>
                    <div className="flex gap-2">
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
                                    label="Tiền cọc"
                                    value={field.value ? parseInt(field.value) : undefined}
                                    onChange={(val) => field.onChange(val.toString())}
                                    required
                                />
                            )}
                        />
                    </div>
                    <div className="flex  gap-2 mt-2">
                        <Controller
                            control={form.control}
                            name="depositRemain"
                            render={({ field }) => (
                                <PriceInput
                                    label="Tiền cọc  còn lại"
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
                                    id="depositRemainEndDate"
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
                            required
                            label="Kỳ thanh toán"
                            options={paymentPeriods.map(p => ({ value: p.id?.toString(), label: p.name ?? "" }))}
                            placeholder="Chọn kỳ thanh toán"
                        />
                    </div>



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

            {/* Right Column */}
            <div className="flex flex-col gap-6">
                {/* Section 2: Thông tin khách thuê */}
                <div>
                    <h3 className="font-semibold text-lg mb-3">Thông tin khách thuê & xe <span className="text-red-500">*</span> </h3>

                    <div key={customerRows.length} className="space-y-2 mt-10">
                        {customerRows.length > 0 && customerRows.map((row, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="flex-1">
                                    <FormSelect
                                        name={`customer-${index}`}
                                        control={form.control}
                                        options={customers.map(c => ({ value: c.id?.toString() ?? "", label: c.name ?? "" }))}
                                        placeholder="Chọn khách hàng"
                                        onChange={(value) => handleCustomerChange(index, value as string)}
                                    />
                                </div>
                                <div className="flex items-center " title="Người đại diện">
                                    <Switch
                                        label=""
                                        checked={row.isRepresentative}
                                        onChange={(checked) => handleCustomerRepresentativeChange(index, checked)}
                                    />
                                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400"></span>
                                </div>
                                {index > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCustomer(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                    >
                                        <TrashBinIcon className="w-4 h-4" />
                                    </button>
                                ) : <div className="w-8 h-8" />}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddCustomer}
                        className="text-sm text-brand-500 hover:text-brand-600 mt-2"
                    >
                        + Thêm khách hàng
                    </button>
                </div>
                <div className="flex flex-col gap-2 ">
                    <Input {...form.register("vehicleNumber")} label="Số xe" type="number" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Controller
                        control={form.control}
                        name="isSigned"
                        render={({ field }) => (
                            <Switch
                                label="Đã ký hợp đồng"
                                checked={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
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
                                    onChange={(e) => handleServiceChange(index, e.target.value)}
                                    className="w-24"
                                />
                                {index > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteService(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                    >
                                        <TrashBinIcon className="w-4 h-4" />
                                    </button>
                                ) : <div className="w-12 h-8" />}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddService}
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
                                    onChange={(e) => handleAssetChange(index, e.target.value)}
                                    className="w-24"
                                />
                                {index > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAsset(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                    >
                                        <TrashBinIcon className="w-4 h-4" />
                                    </button>
                                ) : <div className="w-12 h-8" />}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddAsset}
                        className="text-sm text-brand-500 hover:text-brand-600 mt-2"
                    >
                        + Thêm tài sản
                    </button>
                </div>


            </div>
        </div>
    );
}
