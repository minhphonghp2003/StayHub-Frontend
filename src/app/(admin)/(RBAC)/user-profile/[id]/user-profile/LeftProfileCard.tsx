"use client"
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Profile } from "@/core/model/RBAC/profile";
import { setImage } from "@/redux/features/images/ImageSlice";
import { useDispatch } from "react-redux";

export default function LeftProfileCard({ profile }: { profile: Profile | null }) {
    const dispatch = useDispatch()
    return (
        <aside className="col-span-12 lg:col-span-3">
            <Card className="overflow-hidden pt-0">
                <div className="h-28 bg-gradient-to-r from-brand-300 via-brand-350 to-brand-400" />

                <CardContent className="pt-0">
                    <div className="flex gap-4 -mt-14 mb-4">
                        <button
                            type="button"
                            onClick={() => {
                                dispatch(setImage([
                                    {
                                        url: profile?.image || '',
                                        alt: profile?.fullname || "Profile"
                                    },

                                ])
                                )
                            }}
                            className=""
                        >
                            <div className="w-24 h-24 rounded-full ring-4 ring-white dark:ring-slate-900 overflow-hidden bg-gray-100 flex-shrink-0">
                                {profile?.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={profile.image} alt={profile.fullname ?? 'avatar'} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold text-lg">{(profile?.fullname ?? 'U').charAt(0)}</div>
                                )}
                            </div>

                            <div className="self-end flex-1">
                                <div className="flex items-top justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold">{profile?.fullname ?? 'Unknown User'}</h2>
                                        <p className="text-xs italic text-gray-500">{profile?.username ?? 'Position not set'}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {profile?.isActive ? (
                                            <div className="w-4 h-4 rounded-full bg-green-500 ring-2 ring-green-200" title="Hoạt động"></div>
                                        ) : (
                                            <div className="w-4 h-4 rounded-full bg-red-500 ring-2 ring-red-200" title="Không hoạt động"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>

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
