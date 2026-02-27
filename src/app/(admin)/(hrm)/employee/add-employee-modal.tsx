import Input from '@/components/form/InputField';
import ActionModal from '@/components/ui/modal/ActionModal';
import { User } from '@/core/model/RBAC/User';
import employeeService from '@/core/service/hrm/employee-service';
import userService from '@/core/service/RBAC/user-service';
import { toastPromise } from '@/lib/alert-helper';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';

type FormValues = {
    fullname: string;
    username: string;
    password: string;
    email: string
};

function AddEmployeeModal({ isOpen, closeModal, reload, propertyId }: { isOpen: boolean; closeModal: any; reload?: any; propertyId: number }) {
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const form = useForm<FormValues>({
        defaultValues: { fullname: "", username: "", password: "", email: "" },
    });

    const watchFullname = form.watch("fullname");

    // 1. Debounced Search Function
    const handleSearch = useDebouncedCallback(async (value: string) => {
        if (!value || value.trim().length === 0) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        // Prevent searching if we just selected a user and the input matches their name
        if (selectedUser && value === selectedUser.fullname) return;

        const users = await userService.getAllUsersNoPaging(value);
        setSearchResults(users);
        setShowDropdown(users.length > 0);
    }, 500);

    // 2. Watch for typing changes to trigger search or clear selection
    useEffect(() => {
        if (selectedUser && watchFullname !== selectedUser.fullname) {
            setSelectedUser(null);
            form.setValue("username", "");
            form.setValue("password", "");
            form.setValue("email", "");
        }
        handleSearch(watchFullname);
    }, [watchFullname, handleSearch, selectedUser, form]);

    // 3. Handle selecting an existing user from the dropdown
    const handleSelectUser = async (user: User) => {
        setSelectedUser(user);
        form.setValue("fullname", user.fullname || "");
        form.setValue("username", user.username || "");
        form.setValue("password", "");
        form.setValue("email", user.email || "");
        form.clearErrors();
        setShowDropdown(false);


    };

    // 4. Handle clearing the selected user manually
    const clearSelection = () => {
        setSelectedUser(null);
        form.reset({ fullname: "", username: "", password: "", email: "" });
        setSearchResults([]);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Initial load and cleanup
    useEffect(() => {
        if (!isOpen) return;
        return () => {
            form.reset();
            setSelectedUser(null);
            setSearchResults([]);
            setShowDropdown(false);
        };
    }, [isOpen, form]);

    const handleAddEmployee: SubmitHandler<FormValues> = async (data) => {
        const payload = {
            propertyId,
            id: selectedUser?.id,
            fullname: selectedUser ? selectedUser.fullname : data.fullname,
            username: selectedUser ? selectedUser.username : data.username,
            password: data.password || undefined,
            email: selectedUser ? selectedUser.email : data.email || undefined,
        };

        try {
            const result = await toastPromise(
                employeeService.createEmployee(payload),
                {
                    loading: selectedUser ? "Đang thêm nhân viên vào cơ sở..." : "Đang tạo nhân viên mới...",
                    success: selectedUser ? "Thêm nhân viên thành công!" : "Tạo nhân viên thành công!",
                    error: selectedUser ? "Thêm nhân viên thất bại!" : "Tạo nhân viên thất bại!",
                }
            );

            if (result) {
                closeModal();
                reload?.();
            }
        } catch { }
    };

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={form.handleSubmit(handleAddEmployee)} heading="Thêm mới Nhân viên">
            <div className="flex flex-col gap-4">

                {/* Autocomplete Fullname Wrapper */}
                <div className="relative" ref={dropdownRef}>
                    <div className="relative">
                        <Input
                            {...form.register("fullname", { required: true })}
                            required
                            label="Họ và Tên"
                            disabled={!!selectedUser}
                        />
                        {selectedUser && (
                            <button
                                type="button"
                                onClick={clearSelection}
                                className="absolute right-3 top-9 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                                title="Hủy chọn người dùng này"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Dropdown Results - Added Dark Mode Support */}
                    {showDropdown && !selectedUser && (
                        <ul className="absolute z-50 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1 divide-y divide-gray-100 dark:divide-gray-800">
                            {searchResults.map(user => (
                                <li
                                    key={user.id}
                                    className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex flex-col transition-colors"
                                    onClick={() => handleSelectUser(user)}
                                >
                                    <span className="font-semibold text-sm text-gray-800 dark:text-white/90">{user.fullname}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Username: {user.username}</span>
                                    {user.email && <span className="text-xs text-gray-500 dark:text-gray-400">Email: {user.email}</span>}
                                    {user.phone && <span className="text-xs text-gray-500 dark:text-gray-400">SĐT: {user.phone}</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Account & Password */}
                <div className="flex-1">
                    <Input
                        {...form.register("email", { required: true })}
                        required
                        label="Email"
                        disabled={!!selectedUser}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Input
                            {...form.register("username", { required: true })}
                            required
                            label="Tài khoản"
                            disabled={!!selectedUser}
                        />
                    </div>
                    <div className="flex-1">
                        <Input
                            {...form.register("password", { required: !selectedUser })}
                            required={!selectedUser}
                            disabled={!!selectedUser}
                            label="Mật khẩu"
                            type="password"
                        />
                    </div>
                </div>

            </div>
        </ActionModal>
    );
}

export default AddEmployeeModal;