"use client"
import Checkbox from "@/components/form/Checkbox"
import { Button } from "@/components/ui/shadcn/button"
import { Card, CardContent } from "@/components/ui/shadcn/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select"
import { Role } from "@/core/model/RBAC/Role"
import { Profile } from "@/core/model/RBAC/profile"
import roleService from "@/core/service/RBAC/role-service"
import userService from "@/core/service/RBAC/user-service"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import LogoutAllDevicesDialog from "./LogoutConfirmModal"

type ModalState = {
    type: "LOGOUT_ALL_DEVICES" | null
}

export default function AccountTab({ profile, onRoleChange }: { profile: Profile | null; onRoleChange?: (roles: Role[]) => void }) {
    const [roles, setRoles] = useState<Role[]>([])
    const [selectedRoles, setSelectedRoles] = useState<Role[]>(profile?.roles || [])
    const [userStatus, setUserStatus] = useState<string>(profile?.isActive ? "active" : "inactive")
    const [modal, setModalState] = useState<ModalState>({ type: null })

    let fetchData = async () => {
        const roles = await roleService.getAllRoles()
        if (roles && roles.length > 0) {
            setRoles(roles)
            if (profile?.roles) {
                setSelectedRoles(profile.roles)
            }
        }
    }

    let assignRoles = async (selectedRoleIds: number[]) => {
        const toastId = toast.loading("Đang cập nhật vai trò...")

        try {
            let result = await userService.assignRoleToUser(profile?.id || 0, selectedRoleIds)
            if (result) {
                setSelectedRoles(roles.filter((r) => selectedRoleIds.includes(r.id ?? 0)))
                if (onRoleChange) {
                    onRoleChange(roles.filter((r) => selectedRoleIds.includes(r.id ?? 0)))
                }
                toast.update(toastId, { render: "Cập nhật vai trò thành công", type: "success", isLoading: false })
            }
        } catch (error) {
            toast.update(toastId, { render: "Lỗi khi cập nhật vai trò", type: "error", isLoading: false })
        } finally {
            toast.dismiss(toastId)
        }
    }

    let handleStatusChange = async (newStatus: string) => {
        const toastId = toast.loading("Đang cập nhật trạng thái...")
        const isActive = newStatus === "active"

        try {
            let result = await userService.setActivateUser(profile?.id || 0, isActive)
            if (result) {
                setUserStatus(newStatus)
                toast.update(toastId, { render: "Cập nhật trạng thái thành công", type: "success", isLoading: false })
            }
        } catch (error) {
            toast.update(toastId, { render: "Lỗi khi cập nhật trạng thái", type: "error", isLoading: false })
        } finally {
            toast.dismiss(toastId)
        }
    }

    let closeModal = () => {
        setModalState({ type: null })
    }

    useEffect(() => {
        if (profile) {
            fetchData()
            setUserStatus(profile.isActive ? "active" : "inactive")
        }
    }, [profile])

    return (
        <div className="mt-6 grid grid-cols-12 gap-6">
            {/* Role & Permissions */}
            <div className="col-span-12 lg:col-span-6">
                <Card>
                    <CardContent>
                        <div className="mb-6 flex items-center gap-2">
                            <svg className="h-5 w-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-base font-semibold">Vai trò & Quyền hạn</h3>
                        </div>

                        <div>
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Vai trò được gán</h4>
                            <div className="mb-4 space-y-2">
                                {roles && roles.length > 0 ? (
                                    roles.map((role: Role, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={selectedRoles.some((r) => r.id === role.id)}
                                                onChange={(checked) => {
                                                    const selectedIds = checked
                                                        ? [...selectedRoles.map((r) => r.id ?? 0), role.id ?? 0]
                                                        : selectedRoles.filter((r) => r.id !== role.id).map((r) => r.id ?? 0)
                                                    assignRoles(selectedIds)
                                                }}
                                            />
                                            <label htmlFor={`role-${role.id}`} className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {role.name}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">Chưa có vai trò nào được tạo.</div>
                                )}
                            </div>
                            <p className="mb-6 text-xs text-gray-400">Chọn vai trò để cấp quyền.</p>
                        </div>

                        <div>
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Quyền hạn hiệu lực</h4>
                            <div className="space-y-2">
                                {selectedRoles.length !== 0 &&
                                    selectedRoles.map((role: Role, idx: number) =>
                                        role.description ? (
                                            <label key={idx} className="flex items-center gap-3">
                                                <svg className="h-4 w-4 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm">{role.description}</span>
                                            </label>
                                        ) : null
                                    )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Status */}
            <div className="col-span-12 lg:col-span-6">
                <Card>
                    <CardContent>
                        <div className="mb-6 flex items-center gap-2">
                            <svg className="h-5 w-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <h3 className="text-base font-semibold">Tình trạng tài khoản</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-600">Trạng thái</label>
                                <Select value={userStatus} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Hoạt động</SelectItem>
                                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-between pt-2">
                                <div>
                                    <div className="text-xs font-medium text-gray-600">Lần đăng nhập cuối</div>
                                    <div className="mt-1 text-sm font-semibold">{profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString("vi-VN") : "Chưa đăng nhập"}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-medium text-gray-600">Tên người dùng</div>
                                    <div className="mt-1 text-sm font-semibold">{profile?.username || "N/A"}</div>
                                </div>
                            </div>

                            <div className="flex gap-2 border-t pt-2">
                                <Button variant="outline" className="flex-1">
                                    Đổi Mật Khẩu
                                </Button>
                                <Button variant="destructive" className="flex-1" onClick={() => setModalState({ type: "LOGOUT_ALL_DEVICES" })}>
                                    Đăng xuất tất cả thiết bị
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <LogoutAllDevicesDialog isOpen={modal.type === "LOGOUT_ALL_DEVICES"} closeModal={closeModal} userId={profile?.id} />
        </div>
    )
}