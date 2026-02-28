import Input from '@/components/form/InputField';
import ActionModal from '@/components/ui/modal/ActionModal';
import userService from '@/core/service/RBAC/user-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
    fullname: string;
    username: string;
    password?: string;
    email: string;
};

function AddUserModal({ isOpen, closeModal, reload }: { isOpen: boolean; closeModal: () => void; reload?: () => void }) {
    const form = useForm<FormValues>({
        defaultValues: { fullname: "", username: "", password: "", email: "" },
    });

    useEffect(() => {
        if (!isOpen) return;
        return () => form.reset();
    }, [isOpen, form]);

    const handleAddUser: SubmitHandler<FormValues> = async (data) => {
        const payload = {
            fullname: data.fullname,
            username: data.username,
            password: data.password,
            email: data.email
        };

        try {
            const result = await toastPromise(
                userService.addUser(payload),
                {
                    loading: "Đang tạo người dùng mới...",
                    success: "Tạo người dùng thành công!",
                    error: "Tạo người dùng thất bại!",
                }
            );

            if (result) {
                closeModal();
                reload?.();
            }
        } catch {}
    };

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={form.handleSubmit(handleAddUser)} heading="Thêm mới Người dùng">
            <div className="flex flex-col gap-4">
                <Input 
                    {...form.register("fullname", { required: true })} 
                    required 
                    label="Họ và Tên" 
                />
                
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Input 
                            {...form.register("username", { required: true })} 
                            required 
                            label="Tài khoản" 
                        />
                    </div>
                    <div className="flex-1">
                        <Input 
                            {...form.register("password", { required: true })} 
                            required 
                            label="Mật khẩu" 
                            type="password" 
                        />
                    </div>
                </div>

                <Input 
                    {...form.register("email", { 
                        required: true,
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email không hợp lệ"
                        }
                    })} 
                    required 
                    label="Email" 
                    type="email" 
                />
            </div>
        </ActionModal>
    );
}

export default AddUserModal;