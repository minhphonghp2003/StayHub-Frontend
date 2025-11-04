export interface AuthModel extends BaseModel {
    email: string;
    image: string;
    id: number;
    token: string;
    refreshToken: string;
    expiresDate: string;
}