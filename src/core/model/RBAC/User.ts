export interface User extends BaseModel {
    username?: string;
    isActive?: boolean;
    fullname?: string;
    email?: string;
    phone?: string;
    image?: string;
    address?: string;
}