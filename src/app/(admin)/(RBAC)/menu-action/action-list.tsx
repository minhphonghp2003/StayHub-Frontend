import { getCompactActionColumns } from '@/app/(admin)/(RBAC)/menu-action/action-columns'
import ComponentCard from '@/components/common/ComponentCard'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs'
import { DataTable } from '@/components/ui/table/data-table'
import { Action } from '@/core/model/RBAC/Action'
import { Menu } from '@/core/model/RBAC/Menu'
import actionService from '@/core/service/RBAC/action-service'
import menuService from '@/core/service/RBAC/menu-service'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function ActionList({ selectedMenu }: { selectedMenu?: Menu | null }) {
  let [assignedActions, setAssignedActions] = useState<Action[]>([])
  let [actionData, setActionData] = useState<Action[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  let [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    fetchData()
  }, [selectedMenu])
  let fetchData = async () => {
    setLoading(true)
    if (selectedMenu) {
      await Promise.all([
        fetchActions(1),
        fetchAssignedActions()]);
    }
    setLoading(false)
  }
  let fetchActions = async (page: number) => {
    let result = await actionService.getAllActions({ pageNumber: page })
    if (result) {
      setActionData(result.data)
      setPageInfo(result.pageInfo ?? null)
    }
  }
  let fetchAssignedActions = async () => {
    if (!selectedMenu) return;
    let result = await menuService.getActionOfMenu(selectedMenu.id ?? 0)
    if (result) {
      setAssignedActions(result)
    }
  }
  let onChangePage = useDebouncedCallback(async (page) => {
    setLoading(true)
    await fetchActions(page)
    setLoading(false)
  }, 500);
  const columns = getCompactActionColumns();
  return (
    <div>
      <Card className='relative'>
        <CardHeader>
          <CardTitle>
            {
              selectedMenu ? <div>
                Phân quyền cho Menu <span className='text-brand-400'>{selectedMenu?.name}</span>
              </div>
                : "Chưa chọn menu"
            }
          </CardTitle>
          <CardDescription>{selectedMenu?.path}</CardDescription>
        </CardHeader>
        <CardContent >

          {
            !selectedMenu ? <div>
              <p>Chọn menu để phân quyền</p>
            </div>
              :
              <div>
                <DataTable inCard={false} columns={columns} data={actionData} currentPage={pageInfo?.currentPage ?? 1} totalPage={pageInfo?.totalPages ?? 1} totalItems={pageInfo?.totalCount ?? 0} onPageChange={onChangePage} name="Danh sách Action" loading={loading} pageSize={pageInfo?.pageSize ?? 0} />
              </div>
          }
        </CardContent>

      </Card>
    </div>
  )
}

export default ActionList