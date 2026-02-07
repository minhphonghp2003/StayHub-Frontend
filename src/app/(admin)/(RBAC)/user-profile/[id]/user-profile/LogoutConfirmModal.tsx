"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog"
import { Button } from "@/components/ui/shadcn/button"
import authenticationService from "@/core/service/RBAC/authentication-service"
import { toastPromise } from "@/lib/alert-helper"
import { LogOut } from "lucide-react"

function LogoutAllDevicesDialog({ isOpen, closeModal, userId }: { isOpen: boolean; closeModal: () => void; userId?: number }) {
    const handleLogoutAllDevices = async () => {
        if (!userId) return

        const result = await toastPromise(
            authenticationService.revokeAllToken({ userId }),
            {
                loading: "Đang đăng xuất khỏi tất cả thiết bị...",
                success: "Đăng xuất khỏi tất cả thiết bị thành công!",
                error: "Đăng xuất khỏi tất cả thiết bị thất bại!",
            }
        )

        if (result?.success) {
            closeModal()
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col items-center gap-4 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <LogOut className="h-6 w-6 text-red-600" />
                    </span>
                    <div>
                        <AlertDialogTitle className="text-lg font-semibold text-center text-red-600">
                            Đăng xuất khỏi tất cả thiết bị?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
                            Người dùng sẽ bị đăng xuất khỏi tất cả các thiết bị và phiên làm việc sẽ kết thúc. Họ sẽ cần đăng nhập lại.
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 flex justify-center gap-3 sm:justify-center">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={handleLogoutAllDevices}>
                            Đăng xuất
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default LogoutAllDevicesDialog