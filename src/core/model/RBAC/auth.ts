export interface AuthModel extends BaseModel {
    fullname: string;
    email: string;
    image: string;
    id: number;
    token: string;
    refreshToken: string;
    expiresDate: string;
}