import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/shadcn/alert-dialog';
import { Button } from '@/components/ui/shadcn/button';
import { Category } from '@/core/model/catalog/category';
import { categoryService } from '@/core/service/catalog/category-service';
import { toastPromise } from '@/lib/alert-helper';
import { Trash2 } from 'lucide-react';
import React from 'react'

function DeleteCategoryModal({ isOpen, closeModal, reload, category }: { isOpen: boolean, closeModal: any, reload?: any, category?: Category | null }) {

    const deleteCategory = async () => {
        const result = category?.id ? await toastPromise(
            categoryService.deleteCategory(category?.id),
            {
                loading: "Đang xoá category...",
                success: "Xóa category thành công!",
                error: "Xóa category thất bại!",
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
                        Xóa {category?.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa {category?.name} vĩnh viễn?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-center gap-2 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={deleteCategory}>
                            Xóa
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}

export default DeleteCategoryModal