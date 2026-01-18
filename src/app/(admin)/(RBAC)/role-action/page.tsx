"use client"
import ActionList from '@/app/(admin)/(RBAC)/role-action/action-list'
import MenuList from '@/app/(admin)/(RBAC)/role-action/menu-list'
import RoleList from '@/app/(admin)/(RBAC)/role-action/role-list'
import UserList from '@/app/(admin)/(RBAC)/role-action/user-list'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { Alert, AlertTitle } from '@/components/ui/shadcn/alert'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/shadcn/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs'
import { DataTable } from '@/components/ui/table/data-table'
import { Role } from '@/core/model/RBAC/Role'
import { Info, PopcornIcon } from 'lucide-react'
import React from 'react'

function RoleActionPage() {
    let [selectedRole, setSelectedRole] = React.useState<Role | null>(null)
    return (
        <div>
            <PageBreadcrumb pagePath='/role-action' pageTitle="Phân quyền vai trò" />
            <div className='grid grid-cols-4 gap-6'>
                <RoleList selectedRole={selectedRole} onSelectRole={setSelectedRole} />
                <div className='col-span-3'>
                    <Card className='relative'>
                        <CardHeader>
                            <CardTitle>
                                {
                                    selectedRole ? <div>
                                        Phân quyền cho  <span className='text-brand-400'>{selectedRole?.name}</span>
                                    </div>
                                        : "Chưa chọn vai trò"
                                }
                            </CardTitle>
                            <CardDescription>{selectedRole?.code}</CardDescription>
                        </CardHeader>
                        <CardContent >
                            {
                                !selectedRole ? <div>
                                    <p>Chọn vai trò để phân quyền</p>
                                </div>
                                    :
                                    <Tabs defaultValue="action" className="">
                                        <TabsList>
                                            <TabsTrigger value="action">Action</TabsTrigger>
                                            <TabsTrigger value="menu">Menu</TabsTrigger>
                                            <TabsTrigger value="user">Người dùng</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="action">
                                            <Alert className='my-2'>
                                                <Info color='#f5c94d' />
                                                <AlertTitle className='text-brand-400'>

                                                    Sử dụng tab Menu để phân quyền dễ dàng hơn
                                                </AlertTitle>
                                            </Alert>
                                            <ActionList selectedRole={selectedRole} />
                                        </TabsContent>
                                        <TabsContent value="menu"><MenuList selectedRole={selectedRole} /></TabsContent>
                                        <TabsContent value="user"><UserList /></TabsContent>
                                    </Tabs>
                            }
                        </CardContent>

                    </Card>
                </div>
            </div>
        </div>
    )
}

export default RoleActionPage