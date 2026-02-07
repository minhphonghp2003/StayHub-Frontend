"use client";
import AccountTab from "@/app/(admin)/(RBAC)/user-profile/[id]/user-profile/AccountTab";
import LeftProfileCard from "@/app/(admin)/(RBAC)/user-profile/[id]/user-profile/LeftProfileCard";
import RecentLoginTab from "@/app/(admin)/(RBAC)/user-profile/[id]/user-profile/RecentLoginTab";
import Loading from "@/components/common/Loading";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";

import { Profile } from "@/core/model/RBAC/profile";
import userService from "@/core/service/RBAC/user-service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface LoginActivity {
    id: string;
    dateTime: string;
    ipAddress: string;
    device: string;
    status: "Success" | "Failed";
}

function UserProfile() {
    const params = useParams();
    const id = params.id as string;
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);
    const [loginPage, setLoginPage] = useState(1);
    const [loginPageSize] = useState(10);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfileById(parseInt(id));
                setProfile(data);

                // Mock login activity data
                const mockActivities: LoginActivity[] = [
                    {
                        id: "1",
                        dateTime: "May 15, 2024 09:30 AM",
                        ipAddress: "192.168.1.1",
                        device: "Chrome / Windows",
                        status: "Success"
                    },
                    {
                        id: "2",
                        dateTime: "May 14, 2024 02:15 PM",
                        ipAddress: "192.168.1.1",
                        device: "Mobile Safari / iOS",
                        status: "Success"
                    },
                    {
                        id: "3",
                        dateTime: "May 10, 2024 11:45 AM",
                        ipAddress: "10.0.0.42",
                        device: "Chrome / Windows",
                        status: "Failed"
                    }
                ];
                setLoginActivities(mockActivities);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);



    if (loading) {
        return <Loading />;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
                {/* Left column: basic info */}
                <LeftProfileCard profile={profile} />

                {/* Right column: tabs + settings */}
                <main className="col-span-12 lg:col-span-9">
                    <Card>
                        <CardContent>
                            <Tabs defaultValue="account">
                                <TabsList>
                                    <TabsTrigger value="account">Account</TabsTrigger>
                                    <TabsTrigger value="recent">Recent Login</TabsTrigger>
                                </TabsList>

                                <TabsContent value="account">
                                    <AccountTab profile={profile} />
                                </TabsContent>


                                <TabsContent value="recent">
                                    <RecentLoginTab activities={loginActivities} page={loginPage} pageSize={loginPageSize} onPageChange={setLoginPage} />
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