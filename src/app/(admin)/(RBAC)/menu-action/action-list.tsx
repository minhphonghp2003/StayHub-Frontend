import { getCompactActionColumns } from '@/app/(admin)/(RBAC)/menu-action/action-columns'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import Input from '@/components/form/InputField'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { DataTable } from '@/components/ui/table/data-table'
import { Action } from '@/core/model/RBAC/Action'
import { Menu } from '@/core/model/RBAC/Menu'
import actionService from '@/core/service/RBAC/action-service'
import menuService from '@/core/service/RBAC/menu-service'
import { toastPromise } from '@/lib/alert-helper'
import { Waypoints } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
function ActionList({ selectedMenu }: { selectedMenu?: Menu | null }) {
  let [initAssignedActions, setInitAssignedActions] = useState<Set<number>>(new Set())
  let [assignedActions, setAssignedActions] = useState<Set<number>>(new Set())
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  let [actionData, setActionData] = useState<Action[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  const [search, setSearch] = useState<string | null>(null)
  let [loading, setLoading] = useState<boolean>(false)
  let [isOpenConfirm, setOpenConfirm] = useState<boolean>(false)
  const actionListControllerRef = useRef<AbortController | null>(null)
  const assignedActionControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {

      actionListControllerRef.current?.abort();
      assignedActionControllerRef.current?.abort()
    }
  }, [])

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
  }, [actionData, initAssignedActions])
  // On selected
  useEffect(() => {
    const selectedIds = new Set(
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => Number(rowId))
    );
    let tempAssigned = new Set([...assignedActions])
    actionData.forEach((item, index) => {
      const id = item?.id;
      if (!id) return;

      if (selectedIds.has(index)) {
        tempAssigned.add(id);
      } else {
        tempAssigned.delete(id);
      }
      setAssignedActions(new Set([...tempAssigned]))
    });
  }, [rowSelection,])
  // Reset
  let resetSelected = () => {
    setAssignedActions(new Set([...initAssignedActions]))
    const selection: Record<string, boolean> = {}
    actionData.forEach((action, index) => {
      selection[index] = initAssignedActions.has(action.id ?? 0);
    })
    setRowSelection(selection)
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
  }, [initAssignedActions, assignedActions])
  // Fetch data
  let fetchData = async () => {
    actionListControllerRef.current?.abort()
    const actionListController = new AbortController()
    actionListControllerRef.current = actionListController
    assignedActionControllerRef.current?.abort()
    const assignedActionController = new AbortController()
    assignedActionControllerRef.current = assignedActionController
    setLoading(true)
    if (selectedMenu) {
      await Promise.all([
        fetchActions(1, search, actionListController.signal),
        fetchAssignedActions(assignedActionController.signal)]);
    }
    if (!actionListController.signal.aborted && !assignedActionController.signal.aborted) {

      setLoading(false)
    }
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
  let fetchActions = async (page: number, search: string | null, signal: any,) => {
    let result = await actionService.getAllActions({ pageNumber: page, search }, signal)
    if (result) {
      setActionData(result.data)
      setPageInfo(result.pageInfo ?? null)
    }
  }
  let fetchAssignedActions = async (signal: any) => {
    if (!selectedMenu) return;

    let result = await menuService.getActionOfMenu(selectedMenu.id ?? 0, signal)
    if (result) {
      setAssignedActions(new Set(result.map(e => e.id ?? 0)))
      setInitAssignedActions(new Set(result.map(e => e.id ?? 0)))
    }
  }
  let onChangePage = async (page: number) => {
    actionListControllerRef.current?.abort()
    const controller = new AbortController()
    actionListControllerRef.current = controller
    setLoading(true)
    await fetchActions(page, search, controller.signal)
    setLoading(false)
  };
  let onSearch = useDebouncedCallback(async (value) => {
    setSearch(value)
    actionListControllerRef.current?.abort()
    const controller = new AbortController()
    actionListControllerRef.current = controller
    setLoading(true)
    await fetchActions(1, value, controller.signal)
    setLoading(false)
  }, 1000);
  const columns = getCompactActionColumns();

  return (
    <div>
      <Card className='relative'>
        <CardHeader>
          <CardTitle>

            {
              selectedMenu ? <div className='grid grid-cols-3'>
                <p className='col-span-2'>

                  Phân quyền cho Menu <span className='text-brand-400'>{selectedMenu?.name}</span>
                </p>


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
                <div className='grid grid-cols-3 mb-4 '>
                  <Input className='col-start-3 col-end-4' placeholder="Tìm kiếm..." onChange={(e) => { onSearch(e.target.value) }} />
                </div>
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