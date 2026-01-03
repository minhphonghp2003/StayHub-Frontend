export interface User extends BaseModel {
    username?: string;
    isActive?: boolean;
    fullName?: string;
    email?: string;
    phone?: string;
    image?: string;
    address?: string;
}