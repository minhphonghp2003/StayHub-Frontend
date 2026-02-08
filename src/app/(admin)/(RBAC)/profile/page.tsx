"use client"
import InputField from "@/components/form/InputField"
import TextArea from "@/components/form/TextArea"
import Badge from "@/components/ui/badge/Badge"
import { Button } from "@/components/ui/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs"
import { DataTable } from "@/components/ui/table/data-table"
import { Profile } from "@/core/model/RBAC/profile"
import { Role } from "@/core/model/RBAC/Role"
import userService from "@/core/service/RBAC/user-service"
import { toastPromise } from "@/lib/alert-helper"
import { setImage } from "@/redux/features/images/ImageSlice"
import { ColumnDef } from "@tanstack/react-table"
import { Camera, History, Loader2, Shield, UserPen } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

// --- Mock Data Interface for Login History ---
interface LoginHistory {
    id: number;
    time: string;
    ipAddress: string;
    device: string;
    browser: string;
    status: "Success" | "Failed";
}

function MyProfile() {
    const dispatch = useDispatch()

    // --- State: Profile & Main Logic ---
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // --- State: Profile Form ---
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        address: "",
        image: ""
    })
    const [imagePreview, setImagePreview] = useState<string>("")

    // --- State: Password Change ---
    const [passData, setPassData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    // --- State: Login History (Pagination) ---
    const [loginHistoryData, setLoginHistoryData] = useState<LoginHistory[]>([])
    const [loginLoading, setLoginLoading] = useState(false)
    const [loginPage, setLoginPage] = useState(1)
    const [totalLoginItems, setTotalLoginItems] = useState(0)
    const pageSize = 10;

    useEffect(() => {
        fetchProfile()
        fetchLoginHistory(1)
    }, [])

    // ----------------------------------------------------------------------
    // 1. Profile Logic
    // ----------------------------------------------------------------------
    const fetchProfile = async () => {
        setIsLoading(true)
        try {
            const result = await userService.getMyProfile()
            if (result) {
                setProfile(result)
                setFormData({
                    fullname: result.fullname || "",
                    email: result.email || "",
                    phone: result.phone || "",
                    address: result.address || "",
                    image: result.image || ""
                })
                setImagePreview(result.image || "")
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                setImagePreview(base64String)
                // handleInputChange("image", base64String)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmitProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        const result = await toastPromise(
            userService.updateProfile(profile?.id || 0, formData),
            {
                loading: "Đang cập nhật hồ sơ...",
                success: "Cập nhật hồ sơ thành công!",
                error: "Cập nhật hồ sơ thất bại!"
            }
        )
        if (result?.data) {
            setProfile(result.data)
        }
        setIsSaving(false)
    }

    // ----------------------------------------------------------------------
    // 2. Change Password Logic
    // ----------------------------------------------------------------------
    const handlePassChange = (field: string, value: string) => {
        setPassData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmitPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passData.newPassword !== passData.confirmPassword) {
            // Simple alert, in real app use toast
            alert("Mật khẩu xác nhận không khớp!")
            return
        }

        const mockPromise = new Promise((resolve) => setTimeout(resolve, 1000));

        await toastPromise(mockPromise, {
            loading: "Đang đổi mật khẩu...",
            success: "Đổi mật khẩu thành công!",
            error: "Lỗi khi đổi mật khẩu"
        })

        setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    }

    // ----------------------------------------------------------------------
    // 3. Login History Logic
    // ----------------------------------------------------------------------
    const fetchLoginHistory = async (page: number) => {
        setLoginLoading(true)
        setTimeout(() => {
            const mockData: LoginHistory[] = Array.from({ length: 10 }).map((_, i) => ({
                id: (page - 1) * pageSize + i + 1,
                time: new Date(Date.now() - (i * 86400000)).toLocaleString('vi-VN'),
                ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
                device: i % 2 === 0 ? "Windows 11" : "Mac OS X",
                browser: "Chrome 120.0.0",
                status: "Success"
            }));

            setLoginHistoryData(mockData)
            setTotalLoginItems(25)
            setLoginPage(page)
            setLoginLoading(false)
        }, 500)
    }

    const loginColumns: ColumnDef<LoginHistory>[] = [
        {
            accessorKey: "index",
            header: ({ column }) => {
                return (
                    <p className="text-center">#</p>
                )
            },
            cell: ({ row }) => null,
        },
        {
            accessorKey: "time",
            header: "Thời gian",
        },
        {
            accessorKey: "device",
            header: "Thiết bị",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.device}</span>
                    <span className="text-xs text-muted-foreground">{row.original.browser}</span>
                </div>
            )
        },
        {
            accessorKey: "ipAddress",
            header: "Địa chỉ IP",
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => (
                <Badge color={row.original.status === "Success" ? "success" : "error"}>
                    {row.original.status === "Success" ? "Thành công" : "Thất bại"}
                </Badge>
            )
        }
    ]


    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-300" />
            </div>
        )
    }

    return (
        <div className="mx-auto space-y-6  pb-10">
            {/* -------------------------------------------------------------------------- */}
            {/* TOP SECTION: User Info Card */}
            {/* -------------------------------------------------------------------------- */}
            <Card className="border-none shadow-sm bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar & Upload */}
                        <div className="relative group">
                            <button
                                type="button"
                                onClick={() => {
                                    dispatch(setImage([{ url: imagePreview, alt: profile?.fullname || "Profile" }]))
                                }}
                                className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md cursor-pointer"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-4xl font-bold text-gray-400">
                                        {profile?.fullname?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                            </button>

                            {/* Hidden File Input trigger */}
                            <div className="absolute bottom-0 right-0">
                                <label
                                    htmlFor="avatar-upload"
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                                >
                                    <Camera className="h-4 w-4" />
                                </label>
                                {/* FIX: Use standard input with matching ID */}
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        {/* Info Text */}
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <div>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {profile?.fullname || "Người dùng"}
                                    </h2>

                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {profile?.email}
                                </p>
                            </div>

                            {/* Roles Badge List */}
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
                                {profile?.roles && profile.roles.length > 0 ? (
                                    profile.roles.map((role: Role, index: number) => (
                                        <Badge key={index} color="info" >
                                            {role.name || role.code || "User"}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge color="info">Member</Badge>
                                )}
                            </div>

                            <div className="text-xs text-gray-400 pt-1">
                                Username: @{profile?.username || "N/A"}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* -------------------------------------------------------------------------- */}
            {/* TABS SECTION */}
            {/* -------------------------------------------------------------------------- */}
            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[500px] mb-4">
                    <TabsTrigger value="info">
                        <UserPen className="w-4 h-4 mr-2" />
                        Cập nhật thông tin
                    </TabsTrigger>
                    <TabsTrigger value="password">
                        <Shield className="w-4 h-4 mr-2" />
                        Đổi mật khẩu
                    </TabsTrigger>
                    <TabsTrigger value="logins">
                        <History className="w-4 h-4 mr-2" />
                        Lịch sử đăng nhập
                    </TabsTrigger>
                </TabsList>

                {/* 1. Edit Profile Form */}
                <TabsContent value="info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cá nhân</CardTitle>
                            <CardDescription>Cập nhật thông tin liên hệ và địa chỉ của bạn.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmitProfile} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Họ và tên"
                                        placeholder="Nhập họ và tên"
                                        value={formData.fullname}
                                        onChange={(e) => handleInputChange("fullname", e.target.value)}
                                        required
                                    />
                                    <InputField
                                        label="Số điện thoại"
                                        placeholder="Nhập số điện thoại"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                    />
                                </div>
                                <InputField
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}

                                />
                                <TextArea
                                    label="Địa chỉ"
                                    placeholder="Nhập địa chỉ chi tiết"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    rows={3}
                                />

                                <div className="flex gap-3 justify-end pt-2">
                                    <Button type="button" variant="outline" onClick={fetchProfile} disabled={isSaving}>
                                        Hoàn tác
                                    </Button>
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</> : "Lưu thay đổi"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 2. Change Password Form */}
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Đổi mật khẩu</CardTitle>
                            <CardDescription>Cập nhật mật khẩu định kỳ để bảo vệ tài khoản.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmitPassword} className="space-y-4 max-w-2xl">
                                <InputField
                                    label="Mật khẩu hiện tại"
                                    type="password"
                                    value={passData.currentPassword}
                                    onChange={(e) => handlePassChange("currentPassword", e.target.value)}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="Mật khẩu mới"
                                        type="password"
                                        value={passData.newPassword}
                                        onChange={(e) => handlePassChange("newPassword", e.target.value)}
                                        required
                                    />
                                    <InputField
                                        label="Xác nhận mật khẩu mới"
                                        type="password"
                                        value={passData.confirmPassword}
                                        onChange={(e) => handlePassChange("confirmPassword", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" variant="default">Cập nhật mật khẩu</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. Login History Table */}
                <TabsContent value="logins">
                    <DataTable
                        name="Nhật ký hoạt động"
                        columns={loginColumns}
                        data={loginHistoryData}
                        currentPage={loginPage}
                        totalPage={Math.ceil(totalLoginItems / pageSize)}
                        totalItems={totalLoginItems}
                        pageSize={pageSize}
                        onPageChange={(page) => fetchLoginHistory(page)}
                        loading={loginLoading}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default MyProfile