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
import { UpdateContractPayload } from "@/core/payload/crm/update-contract-payload";
import { contractService } from "@/core/service/crm/contract-service";
import { unitService } from "@/core/service/infra/unit-service";
import { customerService } from "@/core/service/crm/customer-service";
import { serviceService } from "@/core/service/infra/service-service";
import { assetService } from "@/core/service/infra/asset-service";
import { categoryItemService } from "@/core/service/catalog/category-item-service";
import employeeService from "@/core/service/hrm/employee-service";
import Loading from "@/components/common/Loading";

interface UpdateContractModalProps {
    isOpen: boolean;
    closeModal: () => void;
    reload: () => void;
    contractId: number;
}

function UpdateContractModal({ isOpen, closeModal, reload, contractId }: UpdateContractModalProps) {
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
    const [contractCode, setContractCode] = useState("");

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
        },
    });

    const fetchDropdowns = async () => {
        if (!selectedPropertyId) return;
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
    };

    const fetchInitialData = async () => {
        setInitialLoading(true);
        const contract = await contractService.getContractById(contractId);
        if (contract) {
            setContractCode(contract.code || "");
            // Map customers to customer rows, finding representative from isRepresentative field
            setCustomerRows(
                (contract.customer ?? []).map((customer: any) => ({
                    customerId: customer.id?.toString() ?? "",
                    isRepresentative: customer.isRepresentative === true
                }))
            );
            // Map services from contract
            if (contract.services && contract.services.length > 0) {
                setServiceRows(contract.services.map(s => ({
                    serviceId: s.serviceId?.toString() || "",
                    quantity: s.quantity?.toString() || ""
                })));
            }
            // Map assets from contract
            if (contract.assets && contract.assets.length > 0) {
                setAssetRows(contract.assets.map(a => ({
                    assetId: a.assetId?.toString() || "",
                    quantity: a.quantity?.toString() || ""
                })));
            }
            form.reset({
                customerIds: (contract.customer ?? []).map(c => c.id?.toString() ?? "") || [],
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
                isSigned: contract.isSigned || false,
                templateId: contract.templateId?.toString() || "",
                representativeId: (contract.customer ?? []).find((c: any) => c.isRepresentative)?.id?.toString() ?? "",
                saleId: contract.saleId?.toString() || "",
                vehicleNumber: contract.vehicleNumber?.toString() || "",
            });
        }
        setInitialLoading(false);
    };

    useEffect(() => {
        if (isOpen && selectedPropertyId) {
            fetchDropdowns();
            fetchInitialData();
        }
    }, [isOpen, contractId, selectedPropertyId]);

    const onSubmit = async (data: ContractFormValues) => {
        // Validate required fields
        if (!data.unitId) {
            await toastPromise(Promise.reject(new Error("Vui lòng chọn căn hộ")), {
                loading: "Đang xác nhận...",
                success: "Hoàn thành!",
                error: "Vui lòng chọn căn hộ",
            });
            return;
        }
        if (!data.paymentPeriodId) {
            await toastPromise(Promise.reject(new Error("Vui lòng chọn kỳ thanh toán")), {
                loading: "Đang xác nhận...",
                success: "Hoàn thành!",
                error: "Vui lòng chọn kỳ thanh toán",
            });
            return;
        }
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
            code: contractCode,
            isSigned: data.isSigned || false,
            templateId: data.templateId ? parseInt(data.templateId) : undefined,
            representativeId: representativeId ? parseInt(representativeId) : 0,
            saleId: data.saleId ? parseInt(data.saleId) : undefined,
            vehicleNumber: data.vehicleNumber ? parseInt(data.vehicleNumber) : undefined,
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

export default UpdateContractModal;
