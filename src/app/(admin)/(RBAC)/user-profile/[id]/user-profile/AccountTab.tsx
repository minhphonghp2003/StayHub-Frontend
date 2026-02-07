"use client"
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Role } from "@/core/model/RBAC/Role";
import { Profile } from "@/core/model/RBAC/profile";
import roleService from "@/core/service/RBAC/role-service";
import userService from "@/core/service/RBAC/user-service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AccountTab({ profile, onRoleChange }: { profile: Profile | null, onRoleChange?: (roles: Role[]) => void }) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>(profile?.roles || []);
    let fetchData = async () => {
        const roles = await roleService.getAllRoles();
        if (roles && roles.length > 0) {
            setRoles(roles);
            if (profile?.roles) {
                setSelectedRoles(profile.roles);
            }
        }
    }
    let assignRoles = async (selectedRoleIds: number[]) => {
        const toastId = toast.loading("Đang cập nhật vai trò...");

        try {
            let result = await userService.assignRoleToUser(profile?.id || 0, selectedRoleIds);
            if (result) {
                setSelectedRoles(roles.filter(r => selectedRoleIds.includes(r.id ?? 0)));
                if (onRoleChange) {
                    onRoleChange(roles.filter(r => selectedRoleIds.includes(r.id ?? 0)));
                }
                toast.update(toastId, { render: "Cập nhật vai trò thành công", type: "success", isLoading: false });
            }
        } catch (error) {
            toast.update(toastId, { render: "Lỗi khi cập nhật vai trò", type: "error", isLoading: false });
        }
    }

    useEffect(() => {
        if (profile) {
            fetchData();
        }
    }, [profile]);

    return (
        <div className="grid grid-cols-12 gap-6 mt-6">
            {/* Role & Permissions */}
            <div className="col-span-12 lg:col-span-6">
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <h3 className="text-base font-semibold ">Vai trò & Quyền hạn</h3>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold mb-3">Assigned Roles</h4>
                            <div className="space-y-2 mb-4">
                                {roles && roles.length > 0 ? (
                                    roles.map((role: Role, idx: number) => (
                                        <label key={idx} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedRoles.some(r => r.id === role.id)}
                                                onChange={(e) => {
                                                    const selectedIds = e.target.checked
                                                        ? [...selectedRoles.map(r => r.id ?? 0), role.id ?? 0]
                                                        : selectedRoles.filter(r => r.id !== role.id).map(r => r.id ?? 0);
                                                    assignRoles(selectedIds);
                                                }}
                                                className="w-4 h-4 rounded border-gray-300"
                                            />
                                            <span className="text-sm ">{role.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">Chưa có vai trò nào được tạo.</div>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mb-6">Chọn vai trò để cấp quyền.</p>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quyền hạn hiệu lực</h4>
                            <div className="space-y-2">
                                {
                                    selectedRoles.length !== 0 && selectedRoles.map((role: Role, idx: number) => role.description && (

                                        <label key={idx} className="flex items-center gap-3">
                                            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            <span className="text-sm ">{role.description}</span>
                                        </label>

                                    ))

                                }

                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Status */}
            <div className="col-span-12 lg:col-span-6">
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            <h3 className="text-base font-semibold ">Tình trạng tài khoản</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-2">Trạng thái</label>
                                <input
                                    type="text"
                                    value="Active"
                                    className="w-full px-4 py-2 border-2 border-brand-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                                    readOnly
                                />
                            </div>

                            <div className="flex justify-between pt-2">
                                <div>
                                    <div className="text-xs font-medium text-gray-600">Lần đăng nhập cuối</div>
                                    <div className="text-sm font-semibold  mt-1">2024-05-15 09:30 AM</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-medium text-gray-600">Tên người dùng</div>
                                    <div className="text-sm font-semibold  mt-1">{profile?.username || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t">
                                <Button variant="outline" className="flex-1">
                                    Đổi Mật Khẩu
                                </Button>
                                <Button variant="destructive" className="flex-1">
                                    Đăng xuất tất cả thiết bị
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
