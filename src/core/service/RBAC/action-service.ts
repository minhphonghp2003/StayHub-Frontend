import { CategoryItem } from "@/core/model/catalog/category-item";
import { Action, } from "@/core/model/RBAC/Action";
import actionRepository from "@/core/repository/RBAC/action-repository";


const getAllActions = async (params: any, signal: any): Promise<{ data: Action[], pageInfo?: PageInfo } | null> => {
    var result = await actionRepository.getAllAction({ ...params, signal })
    if (result?.success) {
        return {
            data: result.data ?? [],
            pageInfo: result
        };
    }
    return null;
}
const generateAction = async (): Promise<boolean> => {
    var result = await actionRepository.generateAction()
    if (result.success) {
        return result.data ?? false;
    }
    return false;
}


const allowAnonActionAction = async (id: number, allow: boolean): Promise<boolean | null> => {
    const result = await actionRepository.allowAnonAction(id, allow);
    return result.success ? result.data ?? null : null;
}
export default {
    getAllActions,
    generateAction,
    allowAnonActionAction
};