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
} from "@/components/ui/shadcn/alert-dialog";
import { Button } from '@/components/ui/shadcn/button';
import { Trash2 } from 'lucide-react';
import { toastPromise } from '@/lib/alert-helper';
import { vehicleService } from '@/core/service/crm/vehicle-service';
import { Vehicle } from '@/core/model/crm/vehicle';

function DeleteVehicleModal({
    isOpen,
    onClose,
    onSuccess,
    vehicle,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    vehicle: Vehicle | null;
}) {
    const handleDelete = async () => {
        if (!vehicle?.id) return;
        const result = await toastPromise(vehicleService.deleteVehicle(vehicle.id), {
            loading: "Đang xóa xe...",
            success: "Xe đã được xóa!",
            error: "Xóa xe thất bại",
        });
        if (result) {
            onClose();
            onSuccess();
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => { !open && onClose() }}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col items-center text-center gap-4">
                    <span className="p-4 rounded-full bg-gray-100">
                        <Trash2 className="w-12 h-12 text-red-500" />
                    </span>
                    <AlertDialogTitle className="text-lg font-semibold text-red-600 ">
                        Xóa xe?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa xe này vĩnh viễn?
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

export default DeleteVehicleModal;
