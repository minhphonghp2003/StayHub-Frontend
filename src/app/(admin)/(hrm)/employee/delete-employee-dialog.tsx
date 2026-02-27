import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/shadcn/alert-dialog"
import { Button } from '@/components/ui/shadcn/button'
import { User } from '@/core/model/RBAC/User'
import employeeService from "@/core/service/hrm/employee-service"
import { toastPromise } from '@/lib/alert-helper'
import { Trash2 } from 'lucide-react'

function DeleteEmployeeDialog({ isOpen, closeModal, reload, employee, propertyId }: { isOpen: boolean, closeModal: any, reload?: any, employee?: User | null, propertyId: number }) {

    const deleteEmployee = async () => {
        const result = employee?.id ? await toastPromise(
            employeeService.deleteEmployee(propertyId, employee.id),
            {
                loading: "Đang xoá nhân viên...",
                success: "Xóa nhân viên thành công!",
                error: "Xóa nhân viên thất bại!",
            }
        ) : null;

        if (result) {
            closeModal();
            reload();
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col items-center text-center gap-4">
                    <span className="p-4 rounded-full bg-gray-100">
                        <Trash2 className="w-12 h-12 text-red-500" />
                    </span>
                    <AlertDialogTitle className="text-lg font-semibold text-red-600 ">
                        Xóa {employee?.username}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Bạn có chắc chắn muốn xóa nhân viên <span className="font-bold">{employee?.fullname}</span> khỏi hệ thống? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-center gap-2 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={deleteEmployee}>
                            Xóa
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteEmployeeDialog;