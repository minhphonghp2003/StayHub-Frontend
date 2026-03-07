import Input from '@/components/form/InputField';
import { FormSelect } from '@/components/form/Select';
import Switch from '@/components/form/Switch';
import ActionModal from '@/components/ui/modal/ActionModal';
import { Spinner } from '@/components/ui/shadcn/spinner';
import { UpdateJobPayload } from '@/core/payload/infra/update-job-payload';
import { jobService } from '@/core/service/infra/job-service';
import { unitService } from '@/core/service/infra/unit-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Job } from '@/core/model/infra/job';
import { Unit } from '@/core/model/infra/unit';

type FormValues = {
    name: string;
    unitId?: string;
    description: string;
};

function UpdateJobModal({
    isOpen,
    onClose,
    onSuccess,
    jobId,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jobId: number;
}) {
    const selectedPropertyId = useSelector(
        (state: RootState) => state.property.selectedPropertyId
    );

    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            unitId: undefined,
            description: "",
        },
    });

    const handleUpdate: SubmitHandler<FormValues> = async (data) => {
        if (!selectedPropertyId || !jobId) return;
        const payload: UpdateJobPayload = {
            name: data.name,
            propertyId: selectedPropertyId,
            unitId: data.unitId ? parseInt(data.unitId) : undefined,
            description: data.description,
        };
        try {
            const result = await toastPromise(
                jobService.updateJob(jobId ?? 0, payload),
                {
                    loading: "Đang cập nhật công việc...",
                    success: "Công việc đã được cập nhật thành công!",
                    error: "Cập nhật công việc thất bại",
                }
            );
            if (result) {
                onClose();
                onSuccess?.();
            }
        } catch { }
    };

    const fetchDropdowns = async () => {
        if (!selectedPropertyId) return;
        const list = await unitService.getAllUnitsNoPaging(selectedPropertyId);
        setUnits(list);
    };

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);
        Promise.all([
            jobService.getJobById(jobId),
            fetchDropdowns(),
        ]).then(([jobDetail]) => {
            if (jobDetail) {
                form.reset({
                    name: jobDetail.name ?? "",
                    unitId: jobDetail.unitId?.toString() ?? undefined,
                    description: jobDetail.description ?? "",
                });
            }
            setIsLoading(false);
        });
        return () => {
            form.reset({
                name: "",
                unitId: undefined,
                description: "",
            });
        };
    }, [isOpen, jobId]);

    return (
        <ActionModal
            size="md"
            isOpen={isOpen}
            closeModal={onClose}
            onConfirm={form.handleSubmit(handleUpdate)}
            heading="Cập nhật công việc"
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
                    <Input {...form.register("name")} required label="Tên" />
                    {units.length > 0 &&
                        <FormSelect
                            name="unitId"
                            control={form.control}
                            label="Phòng (tùy chọn)"
                            options={units.map(u => ({ value: u.id?.toString(), label: u.name || "" }))}
                            placeholder="Chọn phòng"
                        />
                    }
                    <Input {...form.register("description")} label="Mô tả" />

                </div>
            </div>
        </ActionModal>
    );
}

export default UpdateJobModal;
