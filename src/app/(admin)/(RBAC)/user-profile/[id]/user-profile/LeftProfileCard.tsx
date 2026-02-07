"use client"
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Profile } from "@/core/model/RBAC/profile";

export default function LeftProfileCard({ profile }: { profile: Profile | null }) {
    return (
        <aside className="col-span-12 lg:col-span-3">
            <Card className="overflow-hidden pt-0">
                <div className="h-28 bg-gradient-to-r from-brand-300 via-brand-350 to-brand-400" />

                <CardContent className="pt-0">
                    <div className="flex gap-4 -mt-14 mb-4">
                        <div className="w-24 h-24 rounded-full ring-4 ring-white dark:ring-slate-900 overflow-hidden bg-gray-100 flex-shrink-0">
                            {profile?.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={profile.image} alt={profile.fullname ?? 'avatar'} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold text-lg">{(profile?.fullname ?? 'U').charAt(0)}</div>
                            )}
                        </div>
                        <div className="self-end">
                            <h2 className="text-xl font-bold self-center">{profile?.fullname ?? 'Unknown User'}</h2>
                            <div className="mt-2 flex flex-wrap gap-2 items-center">
                                {profile?.roles && profile.roles.length > 0 ? (
                                    <span className="px-2.5 py-1 bg-brand-200 text-brand-900 rounded text-xs font-medium">{profile.roles[0].name}</span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">No role</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {profile?.address && (
                        <div className="mb-4 text-sm ">
                            <span className="text-xs ">• {profile.address}</span>
                        </div>
                    )}

                    <div className="space-y-3 text-sm mb-6">
                        <div className="flex items-center gap-3 ">
                            <svg className="w-4 h-4  flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <div className="break-all">{profile?.email ?? '—'}</div>
                        </div>
                        <div className="flex items-center gap-3 ">
                            <svg className="w-4 h-4  flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <div>{profile?.phone ?? '__'}</div>
                        </div>
                    </div>

                    <Button className="w-full" variant="default" size="sm">
                        Gửi tin nhắn
                    </Button>

                </CardContent>
            </Card>
        </aside>
    )
}
