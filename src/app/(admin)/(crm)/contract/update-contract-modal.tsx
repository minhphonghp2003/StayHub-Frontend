"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";

import ActionModal from "@/components/ui/modal/ActionModal";
import Input from "@/components/form/InputField";
import PriceInput from "@/components/form/PriceInput";
import { FormSelect } from "@/components/form/Select";
import Switch from "@/components/form/Switch";
import DatePicker from "@/components/form/date-picker";
import { toastPromise } from "@/lib/alert-helper";
import { RootState } from "@/redux/store";
import { Unit } from "@/core/model/infra/unit";
import { Customer } from "@/core/model/crm/customer";
import { Service } from "@/core/model/infra/service";
import { Asset } from "@/core/model/infra/asset";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { UpdateContractPayload } from "@/core/payload/crm/update-contract-payload";
import { contractService } from "@/core/service/crm/contract-service";
import { unitService } from "@/core/service/infra/unit-service";
import { customerService } from "@/core/service/crm/customer-service";
import { serviceService } from "@/core/service/infra/service-service";
import { assetService } from "@/core/service/infra/asset-service";
import { categoryItemService } from "@/core/service/catalog/category-item-service";
import { TrashBinIcon } from "@/icons";
import Loading from "@/components/common/Loading";

interface UpdateContractModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
    contractId: number;
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
    code: string;
    isSigned: boolean;
    templateId?: string;
    representativeId: string;
    services?: { serviceId: string; quantity: string }[];
    assets?: { assetId: string; quantity: string }[];
};

function UpdateContractModal({ isOpen, closeModal, reload, contractId }: UpdateContractModalProps) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [units, setUnits] = useState<Unit[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [paymentPeriods, setPaymentPeriods] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [serviceRows, setServiceRows] = useState<{ serviceId: string; quantity: string }[]>([{ serviceId: "", quantity: "" }]);
    const [assetRows, setAssetRows] = useState<{ assetId: string; quantity: string }[]>([{ assetId: "", quantity: "" }]);
    const [customerRows, setCustomerRows] = useState<{ customerId: string; isRepresentative: boolean }[]>([{ customerId: "", isRepresentative: false }]);

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
            code: "",
            isSigned: false,
            templateId: "",
            representativeId: "",
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

    const fetchInitialData = async () => {
        setInitialLoading(true);
        const contract = await contractService.getContractById(contractId);
        if (contract) {
            const customerIds = contract.customers?.map(c => c.id ?? 0) || [];
            setCustomerRows(
                (contract.customers ?? []).map((customer: any) => ({
                    customerId: customer.id?.toString() ?? "",
                    isRepresentative: customer.id === contract.representativeId
                }))
            );
            form.reset({
                customerIds: customerIds.map(id => id.toString()) || [],
                unitId: contract.unitId?.toString() || "",
                price: contract.price?.toString() || "",
                deposit: contract.deposit?.toString() || "",
                depositRemain: contract.depositRemain?.toString() || "",
                depositRemainEndDate: contract.depositRemainEndDate || "",
                startDate: contract.startDate,
                endDate: contract.endDate,
                paymentPeriodId: contract.paymentPeriodId?.toString() || "",
                note: contract.note || "",
                attachment: contract.attachment || "",
                code: contract.code,
                isSigned: contract.isSigned || false,
                templateId: contract.templateId?.toString() || "",
                representativeId: (contract.representativeId ?? 0).toString(),
            });
            if (contract.services && contract.services.length > 0) {
                setServiceRows(contract.services.map(s => ({ serviceId: s.serviceId?.toString() || "", quantity: s.quantity?.toString() || "" })));
            }
            if (contract.assets && contract.assets.length > 0) {
                setAssetRows(contract.assets.map(a => ({ assetId: a.assetId?.toString() || "", quantity: a.quantity?.toString() || "" })));
            }
        }
        setInitialLoading(false);
    };

    useEffect(() => {
        if (isOpen && selectedPropertyId) {
            fetchDropdowns();
            fetchInitialData();
        }
    }, [isOpen, contractId, selectedPropertyId]);

    const onSubmit = async (data: FormValues) => {
        const validCustomers = customerRows.filter(r => r.customerId);
        if (validCustomers.length === 0) {
            await toastPromise(Promise.reject(new Error("Vui lòng chọn ít nhất một khách hàng")), {
                loading: "Đang xác nhận...",
                success: "Hoàn thành!",
                error: "Vui lòng chọn ít nhất một khách hàng",
            });
            return;
        }
        const hasRepresentative = customerRows.some(r => r.isRepresentative);
        if (!hasRepresentative) {
            await toastPromise(Promise.reject(new Error("Vui lòng chọn đại diện")), {
                loading: "Đang xác nhận...",
                success: "Hoàn thành!",
                error: "Vui lòng chọn đại diện cho hợp đồng",
            });
            return;
        }
        setLoading(true);
        const customerIds = customerRows.filter(r => r.customerId).map(r => parseInt(r.customerId));
        const representativeId = customerRows.find(r => r.isRepresentative)?.customerId;
        const payload: UpdateContractPayload = {
            customerIds: customerIds,
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
            code: data.code,
            isSigned: data.isSigned || false,
            templateId: data.templateId ? parseInt(data.templateId) : undefined,
            representativeId: representativeId ? parseInt(representativeId) : 0,
            services: serviceRows
                .filter(r => r.serviceId)
                .map(r => ({ serviceId: parseInt(r.serviceId), quantity: parseInt(r.quantity || "0") })),
            assets: assetRows
                .filter(r => r.assetId)
                .map(r => ({ assetId: parseInt(r.assetId), quantity: parseInt(r.quantity || "0") })),
        };

        const result = await toastPromise(contractService.updateContract(contractId, payload), {
            loading: "Đang cập nhật hợp đồng...",
            success: "Hợp đồng đã được cập nhật!",
            error: "Cập nhật hợp đồng thất bại",
        });
        setLoading(false);
        if (result) {
            closeModal();
            reload();
            setCustomerRows([{ customerId: "", isRepresentative: false }]);
        }
    };

    if (initialLoading) {
        return (
            <ActionModal isOpen={isOpen} closeModal={closeModal} heading="Cập nhật hợp đồng">
                <Loading />
            </ActionModal>
        );
    }

    return (
        <ActionModal
            isOpen={isOpen}
            closeModal={closeModal}
            heading="Cập nhật hợp đồng"
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
                                        id="update-startDate"
                                        label="Ngày bắt đầu"
                                        placeholder="Chọn ngày bắt đầu"
                                        defaultDate={field.value}
                                        onChange={(selectedDates) => {
                                            if (selectedDates[0]) {
                                                const date = new Date(selectedDates[0]);
                                                const formatted = date.toISOString().split('T')[0];
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
                                        id="update-endDate"
                                        label="Ngày kết thúc"
                                        placeholder="Chọn ngày kết thúc"
                                        defaultDate={field.value}
                                        onChange={(selectedDates) => {
                                            if (selectedDates[0]) {
                                                const date = new Date(selectedDates[0]);
                                                const formatted = date.toISOString().split('T')[0];
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
                                        id="update-depositRemainEndDate"
                                        label="Hạn thanh toán cọc"
                                        placeholder="Chọn hạn thanh toán"
                                        defaultDate={field.value}
                                        onChange={(selectedDates) => {
                                            if (selectedDates[0]) {
                                                const date = new Date(selectedDates[0]);
                                                const formatted = date.toISOString().split('T')[0];
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
                    {/* Section 2: Thông tin khách thuê */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Thông tin khách thuê</h3>
                        <div className="space-y-2">
                            {customerRows.map((row, index) => (
                                <div key={index} className="flex gap-2">
                                    <div className="flex-1">
                                        <FormSelect
                                            name={`customer-${index}`}
                                            control={form.control}
                                            options={customers.map(c => ({ value: c.id?.toString() ?? "", label: c.name ?? "" }))}
                                            placeholder="Chọn khách hàng"
                                            onChange={(value) => {
                                                const newRows = [...customerRows];
                                                newRows[index].customerId = value as string;
                                                setCustomerRows(newRows);
                                                // Update form values
                                                const customerIds = newRows.filter(r => r.customerId).map(r => r.customerId);
                                                form.setValue("customerIds", customerIds);
                                                // Set representative
                                                const representative = newRows.find(r => r.isRepresentative);
                                                if (representative?.customerId) {
                                                    form.setValue("representativeId", representative.customerId);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <Switch
                                            label=""
                                            checked={row.isRepresentative}
                                            onChange={(checked) => {
                                                const newRows = [...customerRows];
                                                // Only one representative at a time
                                                if (checked) {
                                                    newRows.forEach((r, i) => {
                                                        r.isRepresentative = i === index;
                                                    });
                                                    if (row.customerId) {
                                                        form.setValue("representativeId", row.customerId);
                                                    }
                                                } else {
                                                    newRows[index].isRepresentative = false;
                                                    form.setValue("representativeId", "");
                                                }
                                                setCustomerRows(newRows);
                                            }}
                                        />
                                        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Đại diện</span>
                                    </div>
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setCustomerRows(customerRows.filter((_, i) => i !== index))}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                        >
                                            <TrashBinIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setCustomerRows([...customerRows, { customerId: "", isRepresentative: false }])}
                            className="text-sm text-brand-500 hover:text-brand-600 mt-2"
                        >
                            + Thêm khách hàng
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
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                        >
                                            <TrashBinIcon className="w-4 h-4" />
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
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                        >
                                            <TrashBinIcon className="w-4 h-4" />
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

export default UpdateContractModal;
