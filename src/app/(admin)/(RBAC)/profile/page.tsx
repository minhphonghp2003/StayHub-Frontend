"use client"
import FileInput from "@/components/form/FileInput"
import InputField from "@/components/form/InputField"
import TextArea from "@/components/form/TextArea"
import { Button } from "@/components/ui/shadcn/button"
import { Card, CardContent } from "@/components/ui/shadcn/card"
import { Profile } from "@/core/model/RBAC/profile"
import userService from "@/core/service/RBAC/user-service"
import { toastPromise } from "@/lib/alert-helper"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

function MyProfile() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        address: "",
        image: ""
    })
    const [imagePreview, setImagePreview] = useState<string>("")

    useEffect(() => {
        fetchProfile()
    }, [])

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
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                // setFormData(prev => ({
                //     ...prev,
                //     image: base64String
                // }))
                setImagePreview(base64String)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        const result = await toastPromise(
            userService.updateProfile(profile?.id ?? 0, formData),
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

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-300" />
            </div>
        )
    }

    return (
        <div className="mx-auto ">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Hồ sơ của tôi</h1>
                <p className="text-sm text-gray-500">Cập nhật thông tin cá nhân của bạn</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
                {/* Avatar Section */}
                <div className="col-span-12 lg:col-span-4">
                    <Card>
                        <CardContent className="flex flex-col items-center pt-6">
                            <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-gray-200 bg-gray-100">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gray-400">
                                        {profile?.fullname?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>

                            <FileInput
                                onChange={handleImageChange}
                            />

                            <div className="mt-4 w-full border-t pt-4 text-center text-xs text-gray-500">
                                <p>Username: {profile?.username}</p>
                                <p>Email: {profile?.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Profile Form */}
                <div className="col-span-12 lg:col-span-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <InputField
                                    label="Họ và tên"
                                    placeholder="Nhập họ và tên"
                                    value={formData.fullname}
                                    onChange={(e) => handleInputChange("fullname", e.target.value)}
                                    required
                                />

                                <InputField
                                    label="Email"
                                    type="email"
                                    placeholder="Nhập email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    required
                                    disabled
                                />

                                <InputField
                                    label="Số điện thoại"
                                    placeholder="Nhập số điện thoại"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                />

                                <TextArea
                                    label="Địa chỉ"
                                    placeholder="Nhập địa chỉ"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    rows={4}
                                />

                                <div className="flex gap-3 border-t pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={fetchProfile}
                                        disabled={isSaving}
                                        className="flex-1"
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang lưu...
                                            </>
                                        ) : (
                                            "Lưu thay đổi"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}

export default MyProfile