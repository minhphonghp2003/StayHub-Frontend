import { getUserColumns } from '@/app/(admin)/(RBAC)/role-action/user-columns'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/shadcn/button'
import { DataTable } from '@/components/ui/table/data-table'
import { Role } from '@/core/model/RBAC/Role'
import { User } from '@/core/model/RBAC/User'
import userService from '@/core/service/RBAC/user-service'
import { Waypoints } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

function UserList({ selectedRole }: { selectedRole?: Role | null }) {
  let [userData, setUserData] = useState<User[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  let [loading, setLoading] = useState<boolean>(false)

  const userListControllerRef = useRef<AbortController | null>(null)
  useEffect(() => {
    return () => {
      userListControllerRef.current?.abort();
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [selectedRole])

  let fetchData = async () => {
    userListControllerRef.current?.abort()
    const userListController = new AbortController()
    userListControllerRef.current = userListController

    setLoading(true)
    if (selectedRole) {
      await fetchUsers(1, userListController.signal)
    }
    setLoading(false)
  }

  let fetchUsers = async (page: number, signal: any) => {
    console.log(page);

    let result = await userService.getUserOfRole(selectedRole?.id ?? 0, { pageNumber: page }, signal)
    if (result) {
      setUserData(result.data)
      setPageInfo(result.pageInfo ?? null)
    }
  }

  let onChangePage = async (page: number) => {
    userListControllerRef.current?.abort()
    const controller = new AbortController()
    userListControllerRef.current = controller
    setLoading(true)
    await fetchUsers(page, controller.signal)
    setLoading(false)
  };
  const columns = getUserColumns();

  return (
    <div className=''>
      <div>
        <DataTable inCard={false} columns={columns} data={userData} currentPage={pageInfo?.currentPage ?? 1} totalPage={pageInfo?.totalPages ?? 1} totalItems={pageInfo?.totalCount ?? 0} onPageChange={onChangePage} name="Danh sách User" loading={loading} pageSize={pageInfo?.pageSize ?? 0} />

      </div>
    </div>
  )
}

export default UserList