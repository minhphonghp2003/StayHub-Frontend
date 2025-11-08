export interface AddMenuPayload {
    name: string;
    path: string;
    groupId: number;
    description?: string;
    icon?: string;
    parentId?: number;
}