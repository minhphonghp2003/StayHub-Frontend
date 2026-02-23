"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog";
import { Button } from "@/components/ui/shadcn/button";
import { Property } from "@/core/model/pmm/property";
import { propertyService } from "@/core/service/pmm/property-service";
import { toastPromise } from "@/lib/alert-helper";
import { Trash2 } from "lucide-react";

function DeletePropertyModal({
    isOpen,
    closeModal,
    reload,
    property,
}: {
    isOpen: boolean;
    closeModal: any;
    reload?: any;
    property?: Property | null;
}) {
    const deleteProperty = async () => {
        const result = property?.id
            ? await toastPromise(propertyService.deleteProperty(property?.id), {
                loading: "Đang xoá property...",
                success: "Xóa property thành công!",
                error: "Xóa property thất bại!",
            })
            : null;
        if (result) {
            closeModal();
            reload?.();
        }
    };

    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={(open) => {
                !open && closeModal();
            }}
        >
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col items-center text-center gap-4">
                    <span className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                        <Trash2 className="w-12 h-12 text-red-500" />
                    </span>
                    <AlertDialogTitle className="text-lg font-semibold text-red-600">
                        Xóa {property?.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa{" "}
                        {property?.name} vĩnh viễn?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-center gap-2 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={deleteProperty}>
                            Xóa
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeletePropertyModal;
