import { CategoryItem } from '@/core/model/catalog/category-item';
import { Menu } from '@/core/model/RBAC/Menu';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import { useModal } from '@/hooks/useModal';
import React, { useEffect, useState } from 'react'

function MenuGroup() {
    let [group, setGroup] = useState<CategoryItem[]>([])

    useEffect(() => {
        categoryItemService.getCategoryItemsByCategoryCode("MENU").then(e => setGroup(e))
    }, [])
    return (
        <div>{}</div>
    )
}

export default MenuGroup