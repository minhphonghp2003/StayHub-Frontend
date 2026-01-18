import { getMenuColumns } from '@/app/(admin)/(RBAC)/role-action/menu-columns'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/shadcn/button'
import { DataTable } from '@/components/ui/table/data-table'
import { Menu } from '@/core/model/RBAC/Menu'
import { Role } from '@/core/model/RBAC/Role'
import menuService from '@/core/service/RBAC/menu-service'
import roleService from '@/core/service/RBAC/role-service'
import { toastPromise } from '@/lib/alert-helper'
import { Waypoints } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

function MenuList({ selectedRole }: { selectedRole?: Role | null }) {
  let [initAssignedMenus, setInitAssignedMenus] = useState<Set<number>>(new Set())
  let [assignedMenus, setAssignedMenus] = useState<Set<number>>(new Set())
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  let [menuData, setMenuData] = useState<Menu[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  let [loading, setLoading] = useState<boolean>(false)
  let [isOpenConfirm, setOpenConfirm] = useState<boolean>(false)
  const menuListControllerRef = useRef<AbortController | null>(null)
  const assignedMenuControllerRef = useRef<AbortController | null>(null)
  // TODO fix assigned not set on init
  useEffect(() => {
    return () => {
      menuListControllerRef.current?.abort();
      assignedMenuControllerRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [selectedRole])
  // Fetch data selected
  useEffect(() => {

    const selection: Record<string, boolean> = {}
    menuData.forEach((menu, index) => {
      selection[index] = assignedMenus.has(menu.id ?? 0);
    })
    setRowSelection(selection)
  }, [menuData,])
  // On selected
  useEffect(() => {
    const selectedIds = new Set(
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => Number(rowId))
    );
    let tempAssigned = new Set([...assignedMenus])
    menuData.forEach((item, index) => {
      const id = item?.id;
      if (!id) return;

      if (selectedIds.has(index)) {
        tempAssigned.add(id);
      } else {
        tempAssigned.delete(id);
      }
      setAssignedMenus(new Set([...tempAssigned]))
    });
  }, [rowSelection,])
  // Reset
  let resetSelected = () => {
    setAssignedMenus(new Set([...initAssignedMenus]))
    const selection: Record<string, boolean> = {}
    menuData.forEach((menu, index) => {
      selection[index] = initAssignedMenus.has(menu.id ?? 0);
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
    let result = !areSetsEqual(initAssignedMenus, assignedMenus)
    return result
  }, [initAssignedMenus, assignedMenus])
  // Fetch data
  let fetchData = async () => {
    menuListControllerRef.current?.abort()
    const menuListController = new AbortController()
    menuListControllerRef.current = menuListController
    assignedMenuControllerRef.current?.abort()
    const assignedMenuController = new AbortController()
    assignedMenuControllerRef.current = assignedMenuController
    setLoading(true)
    if (selectedRole) {
      await Promise.all([
        fetchMenus(1, menuListController.signal),
        fetchAssignedMenus(assignedMenuController.signal)]);
    }
    if (!menuListController.signal.aborted && !assignedMenuController.signal.aborted) {

      setLoading(false)
    }
  }
  let assignMenu = async () => {
    const result = await toastPromise(
      roleService.assignMenusToRole([...assignedMenus], selectedRole?.id ?? 0),
      {
        loading: "Đang gán menu...",
        success: "Gán menu thành công!",
        error: "Gán menu thất bại!",
      }
    );
    if (result) {
      setInitAssignedMenus(new Set(result))
      setAssignedMenus(new Set(result))
    }
  }
  let fetchMenus = async (page: number, signal: any) => {
    let result = await menuService.getAllMenus({ pageNumber: page, }, signal)
    if (result) {
      setMenuData(result.data)
      setPageInfo(result.pageInfo ?? null)
    }
  }
  let fetchAssignedMenus = async (signal: any) => {
    if (!selectedRole) return;

    let result = await roleService.getMenusOfRole(selectedRole.id ?? 0, signal)
    if (result) {
      setAssignedMenus(new Set(result.map(e => e.id ?? 0)))
      setInitAssignedMenus(new Set(result.map(e => e.id ?? 0)))
    }
  }
  let onChangePage = async (page: number) => {
    menuListControllerRef.current?.abort()
    const controller = new AbortController()
    menuListControllerRef.current = controller
    setLoading(true)
    await fetchMenus(page, controller.signal)
    setLoading(false)
  };
  const columns = getMenuColumns();

  return (
    <div className=''>
      <div>
        <DataTable inCard={false} columns={columns} data={menuData} currentPage={pageInfo?.currentPage ?? 1} totalPage={pageInfo?.totalPages ?? 1} totalItems={pageInfo?.totalCount ?? 0} onPageChange={onChangePage} name="Danh sách Menu" loading={loading} pageSize={pageInfo?.pageSize ?? 0} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />
        {
          canSave && <div className='flex justify-end gap-2'>
            <Button className='' onClick={() => { setOpenConfirm(true) }}> Save change</Button>
            <Button variant={"ghost"} className='' onClick={resetSelected}> Cancel</Button>

          </div>
        }
      </div>
      <ConfirmDialog isOpen={isOpenConfirm} closeModal={setOpenConfirm} title={`Phân quyền cho Role`} desc={`Xác nhận gán ${assignedMenus.size} menu cho Role ${selectedRole?.name}`} action={
        <Button variant="default" onClick={assignMenu}>
          Xác nhận
        </Button>
      } icon={<Waypoints className='' />} titleClassName={''} />
    </div>
  )
}

export default MenuList