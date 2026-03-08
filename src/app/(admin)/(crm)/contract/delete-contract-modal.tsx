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
import { contractService } from '@/core/service/crm/contract-service';
import { Contract } from '@/core/model/crm/contract';

function DeleteContractModal({
    isOpen,
    onClose,
    onSuccess,
    contract,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    contract: Contract | null;
}) {
    const handleDelete = async () => {
        if (!contract?.id) return;
        const result = await toastPromise(contractService.deleteContract(contract.id), {
            loading: "Đang xóa hợp đồng...",
            success: "Hợp đồng đã được xóa!",
            error: "Xóa hợp đồng thất bại",
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
                        Xóa hợp đồng?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa hợp đồng này vĩnh viễn?
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

export default DeleteContractModal;
