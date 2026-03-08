import Input from '@/components/form/InputField';
import ActionModal from '@/components/ui/modal/ActionModal';
import userService from '@/core/service/RBAC/user-service';
import { toastPromise } from '@/lib/alert-helper';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
    fullname: string;
    username: string;
    password?: string;
    email: string;
};

function AddUserModal({ isOpen, closeModal, reload }: { isOpen: boolean; closeModal: () => void; reload?: () => void }) {
    const form = useForm<FormValues>({
        defaultValues: { fullname: "", username: "", password: "", email: "" },
        mode: "onChange",
        resolver: async (values) => {
            const errors: any = {};

            if (!values.fullname?.trim()) {
                errors.fullname = { message: "Vui lòng nhập họ và tên" };
            }

            if (!values.username?.trim()) {
                errors.username = { message: "Vui lòng nhập tài khoản" };
            }

            if (!values.password?.trim()) {
                errors.password = { message: "Vui lòng nhập mật khẩu" };
            }

            if (!values.email?.trim()) {
                errors.email = { message: "Vui lòng nhập email" };
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = { message: "Email không hợp lệ" };
            }

            return {
                values,
                errors,
            };
        },
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
        } catch { }
    };

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={form.handleSubmit(handleAddUser)} heading="Thêm mới Người dùng">
            <div className="flex flex-col gap-4">
                <Controller
                    name="fullname"
                    control={form.control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            required
                            label="Họ và Tên"
                            errorMessage={form.formState.errors.fullname?.message}
                        />
                    )}
                />

                <div className="flex gap-2">
                    <div className="flex-1">
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    required
                                    label="Tài khoản"
                                    errorMessage={form.formState.errors.username?.message}
                                />
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    required
                                    label="Mật khẩu"
                                    type="password"
                                    errorMessage={form.formState.errors.password?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                <Controller
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            required
                            label="Email"
                            type="email"
                            errorMessage={form.formState.errors.email?.message}
                        />
                    )}
                />
            </div>
        </ActionModal>
    );
}

export default AddUserModal;