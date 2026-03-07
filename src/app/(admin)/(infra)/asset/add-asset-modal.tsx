import Input from '@/components/form/InputField';
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
                    loading: "Creating asset...",
                    success: "Asset created!",
                    error: "Failed to create asset",
                }
            );
            if (result) {
                onClose();
                onSuccess?.();
                form.reset();
            }
        } catch { }
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
            heading="Add Asset"
        >
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input {...form.register("name")} required label="Name" />
                    <FormSelect
                        name="typeId"
                        control={form.control}
                        label="Type"
                        required
                        options={assetTypes.map(t => ({ value: t.id?.toString(), label: t.name || "" }))}
                        placeholder="Select type"
                    />
                </div>
                <div className="flex gap-2">
                    <Input {...form.register("quantity", { valueAsNumber: true })} type="number" required label="Quantity" />
                    <Input {...form.register("price", { valueAsNumber: true })} type="number" label="Price" />
                </div>
                <FormSelect
                    name="unitId"
                    control={form.control}
                    label="Unit (Optional)"
                    options={units.map(u => ({ value: u.id?.toString(), label: u.name || "" }))}
                    placeholder="Select unit"
                />
                <Input {...form.register("note")} label="Note" />
                <Input {...form.register("image")} required label="Image" />
            </div>
        </ActionModal>
    );
}

export default AddAssetModal;
