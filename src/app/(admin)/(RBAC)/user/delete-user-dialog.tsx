import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/shadcn/alert-dialog"
import { Button } from '@/components/ui/shadcn/button'
import { User } from '@/core/model/RBAC/User'
import userService from '@/core/service/RBAC/user-service'
import { toastPromise } from '@/lib/alert-helper'
import { Trash2 } from 'lucide-react'

function DeleteUserDialog({ isOpen, closeModal, reload, user }: { isOpen: boolean, closeModal: () => void, reload?: () => void, user?: User | null }) {

    const deleteUser = async () => {
        const result = user?.id ? await toastPromise(
            userService.deleteUser(user.id),
            {
                loading: "Đang xoá người dùng...",
                success: "Xóa người dùng thành công!",
                error: "Xóa người dùng thất bại!",
            }
        ) : null;
        
        if (result) {
            closeModal();
            reload?.();
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col items-center text-center gap-4">
                    <span className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                        <Trash2 className="w-12 h-12 text-red-500" />
                    </span>
                    <AlertDialogTitle className="text-lg font-semibold text-red-600 ">
                        Xóa {user?.username}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Bạn có chắc chắn muốn xóa người dùng <span className="font-bold">{user?.fullname || user?.username}</span> khỏi hệ thống? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-center gap-2 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={deleteUser}>
                            Xóa
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteUserDialog;