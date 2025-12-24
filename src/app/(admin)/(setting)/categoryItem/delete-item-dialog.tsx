import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/shadcn/alert-dialog';
import { Button } from '@/components/ui/shadcn/button';
import { CategoryItem } from '@/core/model/catalog/category-item';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import { toastPromise } from '@/lib/alert-helper';
import { Trash2 } from 'lucide-react';
import React from 'react'

function DeleteItemDialog({ isOpen, closeModal, reload, item }: { isOpen: boolean, closeModal: any, reload?: any, item?: CategoryItem | null }) {
    const deleteItem = async () => {
        const result = item?.id ? await toastPromise(
            categoryItemService.deleteCategoryItem(item?.id),
            {
                loading: "Đang xoá item...",
                success: "Xóa item thành công!",
                error: "Xóa item thất bại!",
            }
        ) : null;
        if (result) {
            reload()
        }

    }
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => { !open && closeModal() }}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col items-center text-center gap-4">
                    <span className="p-4 rounded-full bg-gray-100">
                        <Trash2 className="w-12 h-12 text-red-500" />
                    </span>
                    <AlertDialogTitle className="text-lg font-semibold text-red-600 ">
                        Xóa {item?.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa {item?.name} vĩnh viễn?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-center gap-2 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={deleteItem}>
                            Xóa
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteItemDialog