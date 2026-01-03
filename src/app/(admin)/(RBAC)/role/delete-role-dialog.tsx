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
import { Role } from '@/core/model/RBAC/Role'
import roleService from '@/core/service/RBAC/role-service'
import { toastPromise } from '@/lib/alert-helper'
import { Trash2 } from 'lucide-react'
function DeleteRoleDialog({ isOpen, closeModal, reload, role }: { isOpen: boolean, closeModal: any, reload?: any, role?: Role | null }) {

    const deleteRole = async () => {
        const result = role?.id ? await toastPromise(
            roleService.deleterole(role?.id),
            {
                loading: "Đang xoá role...",
                success: "Xóa role thành công!",
                error: "Xóa role thất bại!",
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
                        Xóa {role?.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa {role?.name} vĩnh viễn?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-center gap-2 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={deleteRole}>
                            Xóa
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteRoleDialog