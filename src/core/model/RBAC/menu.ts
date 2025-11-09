export interface MenuGroup {
    name?: string;
    items?: Menu[]
}
export interface Menu extends BaseModel {
    name?: string;
    icon?: string;
    path?: string;
    parentId?: number;
    isActive?: boolean;
    description?: string;
    groupName?: string;
    groupId?: number;
    subItems?: Menu[];
}