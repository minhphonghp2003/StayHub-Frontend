import Input from '@/components/form/InputField';
import ActionModal from '@/components/ui/modal/ActionModal';
import { Role } from '@/core/model/RBAC/Role';
import employeeService from '@/core/service/hrm/employee-service';
import roleService from '@/core/service/RBAC/role-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
    fullname: string;
    username: string;
    password: string;
    roleIds: number[];
};

function AddEmployeeModal({ isOpen, closeModal, reload, propertyId }: { isOpen: boolean; closeModal: any; reload?: any; propertyId: number }) {
    const [roles, setRoles] = useState<Role[]>([]);
    const form = useForm<FormValues>({
        defaultValues: { fullname: "", username: "", password: "", roleIds: [] },
    });

    useEffect(() => {
        if (!isOpen) return;
        // Fetch roles for the dropdown/checkboxes
        roleService.getAllRoles().then(res => setRoles(res));
        
        return () => form.reset();
    }, [isOpen]);

    const handleAddEmployee: SubmitHandler<FormValues> = async (data) => {
        const payload = {
            propertyId,
            ...data
        };

        try {
            const result = await toastPromise(
                employeeService.createEmployee(payload),
                {
                    loading: "Đang tạo nhân viên...",
                    success: "Tạo nhân viên thành công!",
                    error: "Tạo nhân viên thất bại!",
                }
            );

            if (result) {
                closeModal();
                reload?.();
            }
        } catch {}
    };

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={form.handleSubmit(handleAddEmployee)} heading="Thêm mới Nhân viên">
            <div className="flex flex-col gap-4">
                <Input {...form.register("fullname")} required label="Họ và Tên" />
                <div className="flex gap-2">
                    <Input {...form.register("username")} required label="Tài khoản" />
                    <Input {...form.register("password")} required label="Mật khẩu" type="password" />
                </div>
                
                {/* Basic Role Selection Implementation */}
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
        </ActionModal>
    );
}

export default AddEmployeeModal;