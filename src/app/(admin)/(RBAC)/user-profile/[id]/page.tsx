"use client";
import AccountTab from "@/app/(admin)/(RBAC)/user-profile/[id]/user-profile/AccountTab";
import LeftProfileCard from "@/app/(admin)/(RBAC)/user-profile/[id]/user-profile/LeftProfileCard";
import RecentLoginTab from "@/app/(admin)/(RBAC)/user-profile/[id]/user-profile/RecentLoginTab";
import Loading from "@/components/common/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";

import { LoginActivity } from "@/core/model/RBAC/login-activity";
import { Profile } from "@/core/model/RBAC/profile";
import { loginActivityService } from "@/core/service/RBAC/login-activity-service"; // Import the service
import userService from "@/core/service/RBAC/user-service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function UserProfile() {
    const params = useParams();
    const id = params.id as string;

    // Profile State
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // Login Activity State
    const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginPage, setLoginPage] = useState(1);
    const [totalLoginItems, setTotalLoginItems] = useState(0);
    const pageSize = 10;

    // 1. Fetch Profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return;
            setLoadingProfile(true);
            try {
                const data = await userService.getProfileById(parseInt(id));
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [id]);

    // 2. Fetch Login History (Dependent on ID and Page)
    useEffect(() => {
        if (id) {
            fetchUserLoginHistory(parseInt(id), loginPage);
        }
    }, [id, loginPage]);

    const fetchUserLoginHistory = async (userId: number, page: number) => {
        setLoginLoading(true);
        try {
            const res = await loginActivityService.getUserLoginHistory(userId, page, pageSize);
            if (res.success && res.data) {
                setLoginActivities(res.data);
                // Assuming API returns totalCount or similar. 
                // If not available, use length check or separate API.
                // For now, using optional chaining or length fallback
                setTotalLoginItems((res as any).totalCount || res.data.length);
            }
        } catch (error) {
            console.error("Failed to fetch login history:", error);
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="space-y-6 ">
            <PageBreadcrumb pagePath='/user' pageTitle="Người dùng" subTitle={["Chi tiết"]} />

            <div className="grid grid-cols-12 gap-6 relative">
                {loadingProfile ? (
                    <Loading />
                ) : null}

                {/* Left column: basic info */}
                <LeftProfileCard profile={profile} />

                {/* Right column: tabs + settings */}
                <main className="col-span-12 lg:col-span-9">
                    <Card>
                        <CardContent>
                            <Tabs defaultValue="account">
                                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                                    <TabsTrigger value="account">Tài khoản</TabsTrigger>
                                    <TabsTrigger value="recent">Lịch sử đăng nhập</TabsTrigger>
                                </TabsList>

                                <TabsContent value="account">
                                    <AccountTab profile={profile} />
                                </TabsContent>

                                <TabsContent value="recent">
                                    <RecentLoginTab
                                        activities={loginActivities}
                                        page={loginPage}
                                        pageSize={pageSize}
                                        totalItems={totalLoginItems}
                                        onPageChange={(page) => setLoginPage(page)}
                                        loading={loginLoading}
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}

export default UserProfile;