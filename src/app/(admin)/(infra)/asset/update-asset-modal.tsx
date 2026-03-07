import Input from '@/components/form/InputField';
import { FormSelect } from '@/components/form/Select';
import ActionModal from '@/components/ui/modal/ActionModal';
import { Spinner } from '@/components/ui/shadcn/spinner';
import { UpdateAssetPayload } from '@/core/payload/infra/update-asset-payload';
import { assetService } from '@/core/service/infra/asset-service';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import { unitService } from '@/core/service/infra/unit-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Asset } from '@/core/model/infra/asset';
import { CategoryItem } from '@/core/model/catalog/category-item';
import { Unit } from '@/core/model/infra/unit';
import PriceInput from '@/components/form/PriceInput';

type FormValues = {
    name: string;
    quantity: number;
    price?: number;
    typeId: string;
    unitId?: string;
    note?: string;
    image: string;
};

function UpdateAssetModal({
    isOpen,
    onClose,
    onSuccess,
    assetId,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    assetId: number;
}) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [assetTypes, setAssetTypes] = useState<CategoryItem[]>([]);
    const [units, setUnits] = useState<Unit[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            quantity: 1,
            price: undefined,
            typeId: undefined,
            unitId: undefined,
            note: "",
            image: "",
        },
    });

    const handleUpdate: SubmitHandler<FormValues> = async (data) => {
        if (!selectedPropertyId || !assetId) return;
        const payload: UpdateAssetPayload = {
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            typeId: parseInt(data.typeId),
            propertyId: selectedPropertyId,
            unitId: data.unitId ? parseInt(data.unitId) : undefined,
            note: data.note,
            image: data.image,
        };

        try {
            const result = await toastPromise(
                assetService.updateAsset(assetId ?? 0, payload),
                {
                    loading: "Đang cập nhật tài sản...",
                    success: "Tài sản đã được cập nhật!",
                    error: "Cập nhật tài sản thất bại",
                }
            );
            if (result) {
                onClose();
                onSuccess?.();
            }
        } catch (error) {
            console.error("Error updating asset:", error);
        }
    };

    const fetchDropdowns = async () => {
        if (!selectedPropertyId) return;
        const [types, unitsList] = await Promise.all([
            categoryItemService.getCategoryItemsByCategoryCode("ASSET_TYPE"),
            unitService.getAllUnitsNoPaging(selectedPropertyId),
        ]);
        setAssetTypes(types ?? []);
        setUnits(unitsList ?? []);
    };

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);

        Promise.all([
            assetService.getAssetById(assetId),
            fetchDropdowns(),
        ]).then(([assetDetail]) => {
            if (assetDetail) {
                form.reset({
                    name: assetDetail.name ?? "",
                    quantity: assetDetail.quantity ?? 1,
                    price: assetDetail.price,
                    typeId: assetDetail.typeId?.toString() ?? "",
                    unitId: assetDetail.unitId?.toString() ?? "",
                    note: assetDetail.note ?? "",
                    image: assetDetail.image ?? "",
                });
            }
            setIsLoading(false);
        });

        return () => {
            form.reset({
                name: "",
                quantity: 1,
                price: undefined,
                typeId: undefined,
                unitId: undefined,
                note: "",
                image: "",
            });
        };
    }, [isOpen, assetId]);

    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={onClose}
            onConfirm={form.handleSubmit(handleUpdate)}
            heading="Cập nhật tài sản"
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
                    <div className="flex gap-2">
                        <Input {...form.register("name")} required label="Tên" />
                        {assetTypes.length > 0 && <FormSelect
                            name="typeId"
                            control={form.control}
                            label="Loại"
                            required
                            options={assetTypes.map(t => ({ value: t.id?.toString(), label: t.name || "" }))}
                        />
                        }
                    </div>
                    <div className="flex gap-2">
                        <Input {...form.register("quantity", { valueAsNumber: true })} type="number" required label="Số lượng" />
                        <Controller
                            name="price"
                            control={form.control}
                            render={({ field }) => (
                                <PriceInput
                                    label="Giá"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    {units?.length && <FormSelect
                        name="unitId"
                        control={form.control}
                        label="Phòng (Tùy chọn)"
                        options={units.map(u => ({ value: u.id?.toString(), label: u.name || "" }))}
                        placeholder="Chọn phòng"
                    />
                    }
                    <Input {...form.register("note")} label="Ghi chú" />
                    <Input {...form.register("image")} required label="Ảnh" />
                </div>
            </div>
        </ActionModal>
    );
}

export default UpdateAssetModal;
