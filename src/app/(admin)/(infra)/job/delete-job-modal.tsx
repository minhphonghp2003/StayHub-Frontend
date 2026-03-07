import ActionModal from '@/components/ui/modal/ActionModal';
import { jobService } from '@/core/service/infra/job-service';
import { toastPromise } from '@/lib/alert-helper';
import { Job } from '@/core/model/infra/job';
import { useEffect } from 'react';

function DeleteJobModal({
    isOpen,
    onClose,
    onSuccess,
    job,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    job: Job | null;
}) {
    const handleDelete = async () => {
        if (!job?.id) return;
        try {
            const result = await toastPromise(
                jobService.deleteJob(job.id),
                {
                    loading: "Deleting...",
                    success: "Deleted successfully!",
                    error: "Failed to delete",
                }
            );
            if (result) {
                onClose();
                onSuccess?.();
            }
        } catch { };
    };

    useEffect(() => {
        // nothing special
    }, [isOpen]);

    return (
        <ActionModal
            size="sm"
            isOpen={isOpen}
            closeModal={onClose}
            onConfirm={handleDelete}
            heading="Confirm deletion"
        >
            <p>Are you sure you want to delete this job?</p>
        </ActionModal>
    );
}

export default DeleteJobModal;
