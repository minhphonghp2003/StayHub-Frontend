"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import ActionModal from "@/components/ui/modal/ActionModal";
import { ContractForm, ContractFormValues } from "@/components/crm/ContractForm";
import { toastPromise } from "@/lib/alert-helper";
import { RootState } from "@/redux/store";
import { Unit } from "@/core/model/infra/unit";
import { Customer } from "@/core/model/crm/customer";
import { Service } from "@/core/model/infra/service";
import { Asset } from "@/core/model/infra/asset";
import { CategoryItem } from "@/core/model/catalog/category-item";
import { User } from "@/core/model/RBAC/User";
import { AddContractPayload } from "@/core/payload/crm/add-contract-payload";
import { contractService } from "@/core/service/crm/contract-service";
import { unitService } from "@/core/service/infra/unit-service";
import { customerService } from "@/core/service/crm/customer-service";
import { serviceService } from "@/core/service/infra/service-service";
import { assetService } from "@/core/service/infra/asset-service";
import { categoryItemService } from "@/core/service/catalog/category-item-service";
import employeeService from "@/core/service/hrm/employee-service";

interface AddContractModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
}

function AddContractModal({ isOpen, closeModal, reload }: AddContractModalProps) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [units, setUnits] = useState<Unit[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [paymentPeriods, setPaymentPeriods] = useState<CategoryItem[]>([]);
    const [sales, setSales] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [serviceRows, setServiceRows] = useState<{ serviceId: string; quantity: string }[]>([{ serviceId: "", quantity: "" }]);
    const [assetRows, setAssetRows] = useState<{ assetId: string; quantity: string }[]>([{ assetId: "", quantity: "" }]);
    const [customerRows, setCustomerRows] = useState<{ customerId: string; isRepresentative: boolean }[]>([{ customerId: "", isRepresentative: false }]);

    const form = useForm<ContractFormValues>({
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
        mode: "onChange",
        resolver: async (values) => {
            const errors: any = {};

            // Unit validation
            if (!values.unitId) {
                errors.unitId = { message: "Vui lòng chọn căn hộ" };
            }
            if (!values.customerIds || values.customerIds.length === 0) {
                errors.customerIds = { message: "Vui lòng chọn ít nhất một khách hàng" };
            }
            // Date validations
            if (!values.startDate) {
                errors.startDate = { message: "Vui lòng chọn ngày bắt đầu" };
            }
            if (!values.endDate) {
                errors.endDate = { message: "Vui lòng chọn ngày kết thúc" };
            }
            if (values.startDate && values.endDate && new Date(values.startDate) >= new Date(values.endDate)) {
                errors.endDate = { message: "Ngày kết thúc phải sau ngày bắt đầu" };
            }

            // Price validations
            if (!values.price || parseInt(values.price) <= 0) {
                errors.price = { message: "Vui lòng nhập giá hợp đồng hợp lệ" };
            }
            if (!values.deposit || parseInt(values.deposit) <= 0) {
                errors.deposit = { message: "Vui lòng nhập tiền cọc hợp lệ" };
            }
            if (values.price && values.deposit && parseInt(values.deposit) > parseInt(values.price)) {
                errors.deposit = { message: "Tiền cọc không được lớn hơn giá hợp đồng" };
            }

            // Payment period validation
            if (!values.paymentPeriodId) {
                errors.paymentPeriodId = { message: "Vui lòng chọn kỳ thanh toán" };
            }

            return {
                values,
                errors,
            };
        },
    });

    const fetchDropdowns = async () => {
        if (!selectedPropertyId) return;
        setInitialLoading(true);
        const [u, c, s, a, p, sa] = await Promise.all([
            unitService.getAllUnitsNoPaging(selectedPropertyId) ?? Promise.resolve(null),
            customerService.getAllCustomersNoPaging(selectedPropertyId) ?? Promise.resolve(null),
            serviceService.getAllServicesNoPaging(selectedPropertyId) ?? Promise.resolve(null),
            assetService.getAllAssetsNoPaging(selectedPropertyId) ?? Promise.resolve(null),
            categoryItemService.getCategoryItemsByCategoryCode("PAYMENT_PERIOD"),
            employeeService.getAllEmployeesNoPaging(selectedPropertyId) ?? Promise.resolve(null),
        ]);
        setUnits(u ?? []);
        setCustomers(c ?? []);
        setServices(s ?? []);
        setAssets(a ?? []);
        setPaymentPeriods(p ?? []);
        setSales(sa ?? []);
        setInitialLoading(false);
    };

    useEffect(() => {
        if (isOpen && selectedPropertyId) {
            fetchDropdowns();
        }
    }, [isOpen, selectedPropertyId]);

    const onSubmit = async (data: ContractFormValues) => {

        // Validate customer and representative requirements
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
        const payload: AddContractPayload = {
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
            isSigned: data.isSigned || false,
            templateId: data.templateId ? parseInt(data.templateId) : undefined,
            representativeId: representativeId ? parseInt(representativeId) : 0,
            vehicleNumber: data.vehicleNumber ? parseInt(data.vehicleNumber) : undefined,
            saleId: data.saleId ? parseInt(data.saleId) : undefined,
            services: serviceRows
                .filter(r => r.serviceId)
                .map(r => ({ serviceId: parseInt(r.serviceId), quantity: parseInt(r.quantity || "0") })),
            assets: assetRows
                .filter(r => r.assetId)
                .map(r => ({ assetId: parseInt(r.assetId), quantity: parseInt(r.quantity || "0") })),
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
            setCustomerRows([{ customerId: "", isRepresentative: false }]);
        }
    };

    return (
        <ActionModal
            isOpen={isOpen}
            closeModal={closeModal}
            heading="Thêm hợp đồng"
            onConfirm={form.handleSubmit(onSubmit)}
            loading={loading || initialLoading}
            size="2xl"
        >
            <ContractForm
                form={form}
                units={units}
                customers={customers}
                services={services}
                assets={assets}
                paymentPeriods={paymentPeriods}
                sales={sales}
                customerRows={customerRows}
                serviceRows={serviceRows}
                assetRows={assetRows}
                onCustomerRowsChange={setCustomerRows}
                onServiceRowsChange={setServiceRows}
                onAssetRowsChange={setAssetRows}
            />
        </ActionModal>
    );
}

export default AddContractModal;
