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
    parentName?: string;
    groupName?: string;
    groupId?: number;
    children?: Menu[];
}