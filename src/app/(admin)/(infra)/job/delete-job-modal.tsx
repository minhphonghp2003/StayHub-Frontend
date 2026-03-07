import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/shadcn/alert-dialog"
import { Button } from '@/components/ui/shadcn/button'
import { jobService } from '@/core/service/infra/job-service';
import { toastPromise } from '@/lib/alert-helper';
import { Job } from '@/core/model/infra/job';
import { Trash2 } from 'lucide-react';

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

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => { !open && onClose() }}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col items-center text-center gap-4">
                    <span className="p-4 rounded-full bg-gray-100">
                        <Trash2 className="w-12 h-12 text-red-500" />
                    </span>
                    <AlertDialogTitle className="text-lg font-semibold text-red-600 ">
                        Xóa {job?.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa {job?.name} vĩnh viễn?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-center gap-2 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteJobModal;
