import { getCompactActionColumns } from '@/app/(admin)/(RBAC)/menu-action/action-columns'
import ComponentCard from '@/components/common/ComponentCard'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs'
import { DataTable } from '@/components/ui/table/data-table'
import { Action } from '@/core/model/RBAC/Action'
import { Menu } from '@/core/model/RBAC/Menu'
import actionService from '@/core/service/RBAC/action-service'
import menuService from '@/core/service/RBAC/menu-service'
import { toastPromise } from '@/lib/alert-helper'
import { Waypoints } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function ActionList({ selectedMenu }: { selectedMenu?: Menu | null }) {
  let [initAssignedActions, setInitAssignedActions] = useState<Set<number>>(new Set())
  let [assignedActions, setAssignedActions] = useState<Set<number>>(new Set())
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  let [actionData, setActionData] = useState<Action[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  let [loading, setLoading] = useState<boolean>(false)
  let [isOpenConfirm, setOpenConfirm] = useState<boolean>(false)
  useEffect(() => {
    fetchData()
  }, [selectedMenu])
  // Fetch data selected
  useEffect(() => {
    const selection: Record<string, boolean> = {}
    actionData.forEach((action, index) => {
      selection[index] = assignedActions.has(action.id ?? 0);
    })
    setRowSelection(selection)
  }, [assignedActions, actionData])
  // On selected
  useMemo(() => {
    let result = Object.keys(rowSelection)
      .filter(key => rowSelection[key])
      .map(rowId => actionData[Number(rowId)])
      .filter(Boolean)
    result.forEach(e => assignedActions.add(e.id ?? 0));
    return result
  }, [rowSelection,])
  // Reset
  let resetSelected = () => {
    setAssignedActions(new Set(...[initAssignedActions]))
  }
  // Can save
  let canSave = useMemo(() => {
    function areSetsEqual(setA: any, setB: any) {
      if (setA.size !== setB.size) return false;

      for (const value of setA) {
        if (!setB.has(value)) return false;
      }
      return true;
    }
    let result = !areSetsEqual(initAssignedActions, assignedActions)
    return result
  }, [rowSelection])
  // Fetch data
  let fetchData = async () => {
    setLoading(true)
    if (selectedMenu) {
      await Promise.all([
        fetchActions(1),
        fetchAssignedActions()]);
    }
    setLoading(false)
  }
  let assignAction = async () => {
    const result = await toastPromise(
      menuService.assignActionsToMenu([...assignedActions], selectedMenu?.id ?? 0),
      {
        loading: "Đang gán action...",
        success: "Gán action thành công!",
        error: "Gán action thất bại!",
      }
    );
    if (result) {
      setInitAssignedActions(new Set(result))
      setAssignedActions(new Set(result))
    }
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
      setAssignedActions(new Set(result.map(e => e.id ?? 0)))
      setInitAssignedActions(new Set(result.map(e => e.id ?? 0)))
    }
  }
  let onChangePage = async (page: number) => {
    setLoading(true)
    await fetchActions(page)
    setLoading(false)
  };
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
                <DataTable inCard={false} columns={columns} data={actionData} currentPage={pageInfo?.currentPage ?? 1} totalPage={pageInfo?.totalPages ?? 1} totalItems={pageInfo?.totalCount ?? 0} onPageChange={onChangePage} name="Danh sách Action" loading={loading} pageSize={pageInfo?.pageSize ?? 0} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />
                {
                  canSave && <div className='flex justify-end gap-2'>
                    <Button className='' onClick={() => { setOpenConfirm(true) }}> Save change</Button>
                    <Button variant={"ghost"} className='' onClick={resetSelected}> Cancel</Button>

                  </div>
                }
              </div>
          }
        </CardContent>

      </Card>
      <ConfirmDialog isOpen={isOpenConfirm} closeModal={setOpenConfirm} title={`Phân quyền cho Menu`} desc={`Xác nhận gán ${assignedActions.size} action cho Menu ${selectedMenu?.name}`} action={
        <Button variant="default" onClick={assignAction}>
          Xác nhận
        </Button>
      } icon={<Waypoints className='' />} titleClassName={''} />
    </div>
  )
}

export default ActionList