import Input from '@/components/form/InputField';
import ActionModal from '@/components/ui/modal/ActionModal';
import { Spinner } from '@/components/ui/shadcn/spinner';
import { Role } from '@/core/model/RBAC/Role';
import { User } from '@/core/model/RBAC/User';
import employeeService from '@/core/service/hrm/employee-service';
import roleService from '@/core/service/RBAC/role-service';
import userService from '@/core/service/RBAC/user-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
    fullname: string;
    username: string;
    password?: string;
    roleIds: number[];
};

function UpdateEmployeeModal({ isOpen, closeModal, employee, reload, propertyId }: { isOpen: boolean, closeModal: any, employee?: User | null, reload: any, propertyId: number }) {
    const [isLoading, setIsLoading] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const form = useForm<FormValues>();

    useEffect(() => {
        if (!isOpen || !employee) return;
        setIsLoading(true);

        // Fetch all roles AND the user's specific roles simultaneously
        Promise.all([
            roleService.getAllRoles(),
            userService.getRoleOfUser(employee.id ?? 0)
        ]).then(([allRoles, userRoles]) => {
            setRoles(allRoles);

            form.reset({
                fullname: employee.fullName ?? "",
                username: employee.username ?? "",
                password: "", // Leave blank, only send if user types a new one
                roleIds: userRoles?.map(r => r.id) ?? []
            });
            setIsLoading(false);
        });

        return () => form.reset();
    }, [isOpen, employee]);

    const handleSubmitForm: SubmitHandler<FormValues> = async (data) => {
        const payload = {
            propertyId,
            userId: employee?.id,
            fullname: data.fullname,
            username: data.username,
            password: data.password || undefined, // Don't send empty strings to backend
            roleIds: data.roleIds
        };

        try {
            const result = await toastPromise(
                employeeService.updateEmployee(propertyId, employee?.id ?? 0, payload),
                {
                    loading: "Cập nhật nhân viên...",
                    success: "Cập nhật thành công!",
                    error: "Cập nhật thất bại!",
                }
            );
            if (result) {
                closeModal();
                reload();
            }
        } catch { }
    };

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={form.handleSubmit(handleSubmitForm)} heading={"Cập nhật Nhân viên"}>
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
                        <div className="flex flex-col items-center gap-2">
                            <Spinner className="size-14 text-brand-300" />
                            <span className="text-sm text-muted-foreground">Đang tải dữ liệu...</span>
                        </div>
                    </div>
                )}

                <div className={`flex flex-col gap-4 ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
                    <Input {...form.register("fullname")} required label="Họ và Tên" />
                    <div className="flex gap-2">
                        <Input {...form.register("username")} required label="Tài khoản" />
                        <Input {...form.register("password")} label="Mật khẩu mới (Để trống nếu không đổi)" type="password" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Vai trò (Roles)</label>
                        <div className="flex flex-wrap gap-2 border p-3 rounded-md max-h-40 overflow-y-auto">
                            {roles.map(role => (
                                <label key={role.id} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        value={role.id}
                                        {...form.register("roleIds", { valueAsNumber: true })}
                                    />
                                    {role.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ActionModal>
    )
}

export default UpdateEmployeeModal;