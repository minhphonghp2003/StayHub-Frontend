export interface UpdateMenuPayload {
    name: string;
    path: string;
    groupId: number;
    description?: string;
    icon?: string;
    parentId?: number;
    order?: number;
}