"use client";

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
import { Service } from "@/core/model/infra/service";
import { serviceService } from "@/core/service/infra/service-service";
import { toastPromise } from "@/lib/alert-helper";
import { Trash2 } from 'lucide-react';

interface DeleteServiceModalProps {
    isOpen: boolean;
    closeModal: () => void;
    service: Service | null;
    reload: () => void;
}

function DeleteServiceModal({ isOpen, closeModal, service, reload }: DeleteServiceModalProps) {
    const onConfirm = async () => {
        if (!service?.id) return;
        const result = await toastPromise(
            serviceService.deleteService(service.id),
            {
                loading: "Deleting service...",
                success: "Service deleted successfully!",
                error: "Failed to delete service",
            }
        );
        if (result) {
            closeModal();
            reload();
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => { !open && closeModal() }}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col items-center text-center gap-4">
                    <span className="p-4 rounded-full bg-gray-100">
                        <Trash2 className="w-12 h-12 text-red-500" />
                    </span>
                    <AlertDialogTitle className="text-lg font-semibold text-red-600 ">
                        Xóa {service?.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa {service?.name} vĩnh viễn?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-center gap-2 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={onConfirm}>
                            Xóa
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteServiceModal;