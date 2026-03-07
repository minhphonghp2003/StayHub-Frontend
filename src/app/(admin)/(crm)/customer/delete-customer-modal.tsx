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
import { customerService } from '@/core/service/crm/customer-service';
import { Customer } from '@/core/model/crm/customer';

function DeleteCustomerModal({
    isOpen,
    onClose,
    onSuccess,
    customer,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    customer: Customer | null;
}) {
    const handleDelete = async () => {
        if (!customer?.id) return;
        const result = await toastPromise(customerService.deleteCustomer(customer.id), {
            loading: "Đang xóa khách hàng...",
            success: "Khách hàng đã được xóa!",
            error: "Xóa khách hàng thất bại",
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
                        Xóa khách hàng?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa khách hàng này vĩnh viễn?
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

export default DeleteCustomerModal;