"use client"
import Input from '@/components/form/InputField'
import List from '@/components/ui/list/list'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { Tier } from '@/core/model/tier/tier'
import { tierService } from '@/core/service/tier/tier-service'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function TierList({ selectedTier, onSelectTier }: { selectedTier: Tier | null, onSelectTier: (tier: Tier | null) => void }) {
    let [tiers, setTiers] = React.useState<Tier[]>([])
    let [loading, setLoading] = React.useState<boolean>(true)

    let fetchData = async () => {
        setLoading(true)
        let result = await tierService.getAllTiers()
        if (result) {
            setTiers(result)
        }
        setLoading(false)
    }
    let onSearch = useDebouncedCallback((value) => {
        fetchData()
    }, 1000);
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className=''>
            <div className="  rounded-2xl border border-slate-200  dark:border-gray-800 bg-white dark:bg-white/[0.03] flex flex-col overflow-hidden shadow-sm ">
                <div className="p-4 border-b dark:border-gray-800 border-slate-200">
                    <Input placeholder='Tìm kiếm' onChange={(e) => onSearch(e.target.value)} />
                </div>

                {
                    !loading && tiers.length === 0 &&
                    <div className='flex flex-col items-center my-4'>
                        <Image color="red-100" className=" mx-auto" width={50} height={50} src={"/icons/box.png"} alt={""} />
                        <p >
                            Chưa có dữ liệu
                        </p>
                    </div>
                }
                <div className='relative flex-1 overflow-y-auto '>
                    {loading && (
                        <div className="absolute inset-0 z-50 bg-white/70 dark:bg-black/40 
                        flex items-center justify-center backdrop-blur-sm">
                            <Spinner className="size-8" />
                        </div>
                    )}
                    <List items={tiers.map(e => ({ id: e.id, name: e.name, code: e.code }))} selected={selectedTier?.id} onClick={(e: any) => {
                        onSelectTier && onSelectTier(tiers.find(m => m.id === e.id)!)
                    }} />
                </div>
            </div>
        </div>
    )
}

export default TierList
