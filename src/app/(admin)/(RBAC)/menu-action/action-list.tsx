import { Menu } from '@/core/model/RBAC/Menu'
import React from 'react'

function ActionList({ selectedMenu }: { selectedMenu?: Menu | null }) {
  return (
    <div>{selectedMenu?.name}</div>
  )
}

export default ActionList