import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog"
import { Button } from '@/components/ui/shadcn/button'
import { Trash2 } from 'lucide-react'
import { Menu } from '@/core/model/RBAC/Menu'
import menuService from '@/core/service/RBAC/menu-service'
import { toastPromise } from '@/lib/alert-helper'
function MenuDeleteDialog({ isOpen, closeModal, reload, menu }: { isOpen: boolean, closeModal: any, reload?: any, menu?: Menu | null }) {

    const deleteMenu = async () => {
        const result = menu?.id ? await toastPromise(
            menuService.deleteMenu(menu?.id),
            {
                loading: "Đang xoá menu...",
                success: "Xóa menu thành công!",
                error: "Xóa menu thất bại!",
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
                        Xóa {menu?.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa {menu?.name} vĩnh viễn?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-center gap-2 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={deleteMenu}>
                            Xóa
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default MenuDeleteDialog