import { getCompactActionColumns } from '@/app/(admin)/(RBAC)/role-action/action-columns'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { DataTable } from '@/components/ui/table/data-table'
import { Action } from '@/core/model/RBAC/Action'
import { Role } from '@/core/model/RBAC/Role'
import actionService from '@/core/service/RBAC/action-service'
import roleService from '@/core/service/RBAC/role-service'
import { toastPromise } from '@/lib/alert-helper'
import { Waypoints } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
function ActionList({ selectedRole }: { selectedRole?: Role | null }) {
  let [initAssignedActions, setInitAssignedActions] = useState<Set<number>>(new Set())
  let [assignedActions, setAssignedActions] = useState<Set<number>>(new Set())
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  let [actionData, setActionData] = useState<Action[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
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
  }, [selectedRole])
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
    if (selectedRole) {
      await Promise.all([
        fetchActions(1, actionListController.signal),
        fetchAssignedActions(assignedActionController.signal)]);
    }
    if (!actionListController.signal.aborted && !assignedActionController.signal.aborted) {

      setLoading(false)
    }
  }
  let assignAction = async () => {
    const result = await toastPromise(
      roleService.assignActionsToRole([...assignedActions], selectedRole?.id ?? 0),
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
  let fetchActions = async (page: number, signal: any) => {
    let result = await actionService.getAllActions({ pageNumber: page, }, signal)
    if (result) {
      setActionData(result.data)
      setPageInfo(result.pageInfo ?? null)
    }
  }
  let fetchAssignedActions = async (signal: any) => {
    if (!selectedRole) return;

    let result = await roleService.getActionOfRole(selectedRole.id ?? 0, signal)
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
    await fetchActions(page, controller.signal)
    setLoading(false)
  };
  const columns = getCompactActionColumns();

  return (
    <div className=''>
      <div>
        <DataTable inCard={false} columns={columns} data={actionData} currentPage={pageInfo?.currentPage ?? 1} totalPage={pageInfo?.totalPages ?? 1} totalItems={pageInfo?.totalCount ?? 0} onPageChange={onChangePage} name="Danh sách Action" loading={loading} pageSize={pageInfo?.pageSize ?? 0} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />
        {
          canSave && <div className='flex justify-end gap-2'>
            <Button className='' onClick={() => { setOpenConfirm(true) }}> Save change</Button>
            <Button variant={"ghost"} className='' onClick={resetSelected}> Cancel</Button>

          </div>
        }
      </div>
      <ConfirmDialog isOpen={isOpenConfirm} closeModal={setOpenConfirm} title={`Phân quyền cho Role`} desc={`Xác nhận gán ${assignedActions.size} action cho Role ${selectedRole?.name}`} action={
        <Button variant="default" onClick={assignAction}>
          Xác nhận
        </Button>
      } icon={<Waypoints className='' />} titleClassName={''} />
    </div>
  )
}

export default ActionList