import { Role } from "@/core/model/RBAC/Role";

export interface Profile extends BaseModel {
    username?: string;
    isActive?: boolean;
    fullname?: string;
    email?: string;
    phone?: string;
    image?: string;
    address?: string;
    roles?: Role[]
}