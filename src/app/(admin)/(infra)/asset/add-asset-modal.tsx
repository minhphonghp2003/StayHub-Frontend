import Input from '@/components/form/InputField';
import PriceInput from '@/components/form/PriceInput';
import { FormSelect } from '@/components/form/Select';
import Switch from '@/components/form/Switch';
import ActionModal from '@/components/ui/modal/ActionModal';
import { AddAssetPayload } from '@/core/payload/infra/add-asset-payload';
import { assetService } from '@/core/service/infra/asset-service';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import { unitService } from '@/core/service/infra/unit-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CategoryItem } from '@/core/model/catalog/category-item';
import { Unit } from '@/core/model/infra/unit';

type FormValues = {
    name: string;
    quantity: number;
    price?: number;
    typeId: string;
    unitId?: string;
    note?: string;
    image: string;
};

function AddAssetModal({
    isOpen,
    onClose,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [assetTypes, setAssetTypes] = useState<CategoryItem[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);

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

    const handleAdd: SubmitHandler<FormValues> = async (data) => {
        if (!selectedPropertyId) return;
        const payload: AddAssetPayload = {
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
                assetService.createAsset(payload),
                {
                    loading: "Đang tạo tài sản...",
                    success: "Tài sản đã được tạo!",
                    error: "Tạo tài sản thất bại",
                }
            );
            if (result) {
                onClose();
                onSuccess?.();
                form.reset();
            }
        } catch (error) {
            console.error("Error creating asset:", error);
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
        if (isOpen) {
            fetchDropdowns();
        }
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
    }, [isOpen]);

    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={onClose}
            onConfirm={form.handleSubmit(handleAdd)}
            heading="Thêm tài sản"
        >
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input {...form.register("name")} required label="Tên" />
                    <FormSelect
                        name="typeId"
                        control={form.control}
                        label="Loại"
                        required
                        options={assetTypes.map(t => ({ value: t.id?.toString(), label: t.name || "" }))}
                        placeholder="Chọn loại"
                    />
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
                <FormSelect
                    name="unitId"
                    control={form.control}
                    label="Phòng (Tùy chọn)"
                    options={units.map(u => ({ value: u.id?.toString(), label: u.name || "" }))}
                    placeholder="Chọn phòng"
                />
                <Input {...form.register("note")} label="Ghi chú" />
                <Input {...form.register("image")} required label="Hình ảnh" />
            </div>
        </ActionModal>
    );
}

export default AddAssetModal;
