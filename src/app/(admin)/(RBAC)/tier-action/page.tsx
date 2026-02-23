"use client"
import ActionList from '@/app/(admin)/(RBAC)/tier-action/action-list'
import MenuList from '@/app/(admin)/(RBAC)/tier-action/menu-list'
import TierList from '@/app/(admin)/(RBAC)/tier-action/tier-list'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { Alert, AlertTitle } from '@/components/ui/shadcn/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs'
import { Tier } from '@/core/model/tier/tier'
import { Info } from 'lucide-react'
import React from 'react'

function TierActionPage() {
    let [selectedTier, setSelectedTier] = React.useState<Tier | null>(null)
    return (
        <div>
            <PageBreadcrumb pagePath='/tier-action' pageTitle="Phân quyền gói dịch vụ" />
            <div className='grid grid-cols-4 gap-6'>
                <TierList selectedTier={selectedTier} onSelectTier={setSelectedTier} />
                <div className='col-span-3'>
                    <Card className='relative'>
                        <CardHeader>
                            <CardTitle>
                                {
                                    selectedTier ? <div>
                                        Phân quyền cho  <span className='text-brand-400'>{selectedTier?.name}</span>
                                    </div>
                                        : "Chưa chọn gói dịch vụ"
                                }
                            </CardTitle>
                            <CardDescription>{selectedTier?.code}</CardDescription>
                        </CardHeader>
                        <CardContent >
                            {
                                !selectedTier ? <div>
                                    <p>Chọn gói dịch vụ để phân quyền</p>
                                </div>
                                    :
                                    <Tabs defaultValue="menu" className="">
                                        <TabsList>
                                            <TabsTrigger value="action">Action</TabsTrigger>
                                            <TabsTrigger value="menu">Menu</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="action">
                                            <Alert className='my-2'>
                                                <Info color='#f5c94d' />
                                                <AlertTitle className='text-brand-400'>

                                                    Sử dụng tab Menu để phân quyền dễ dàng hơn
                                                </AlertTitle>
                                            </Alert>
                                            <ActionList selectedTier={selectedTier} />
                                        </TabsContent>
                                        <TabsContent value="menu"><MenuList selectedTier={selectedTier} /></TabsContent>
                                    </Tabs>
                            }
                        </CardContent>

                    </Card>
                </div>
            </div>
        </div>
    )
}

export default TierActionPage
