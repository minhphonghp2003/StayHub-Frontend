import Input from "@/components/form/InputField"
import { Button } from "@/components/ui/shadcn/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/shadcn/dialog"
import { Label } from "@/components/ui/shadcn/label"
import authenticationService from "@/core/service/RBAC/authentication-service"
import { useState } from "react"
import { toast } from "react-toastify"

interface ChangeTenantPasswordDialogProps {
    isOpen: boolean
    onClose: () => void
    userId?: number
}

export default function ChangeTenantPasswordDialog({ isOpen, onClose, userId }: ChangeTenantPasswordDialogProps) {
    const [password, setPassword] = useState("")

    const handleSubmit = async () => {
        if (!userId) return
        if (!password) {
            toast.error("Vui lòng nhập mật khẩu mới")
            return
        }

        const toastId = toast.loading("Đang đổi mật khẩu...")

        try {
            // Call the API we defined previously
            const result = await authenticationService.changeTenantPassword({
                userId: userId,
                newPassword: password
            })

            if (result.success) {
                toast.update(toastId, {
                    render: "Đổi mật khẩu thành công!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                })
                setPassword("") // Reset form
                onClose()
            } else {
                throw new Error(result.message || "Lỗi không xác định")
            }
        } catch (error: any) {
            toast.update(toastId, {
                render: error.message || "Lỗi khi đổi mật khẩu",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Đổi mật khẩu người dùng</DialogTitle>
                    <DialogDescription>
                        Nhập mật khẩu mới cho tài khoản này. Hành động này sẽ ghi đè mật khẩu hiện tại.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="  ">
                        <Label htmlFor="new-password" className="text-right mb-3">
                            Mật khẩu mới
                        </Label>
                        <Input
                            id="new-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="col-span-3"
                            placeholder="Nhập mật khẩu..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button onClick={handleSubmit}>Lưu thay đổi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}