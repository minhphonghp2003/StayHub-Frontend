export interface AuthModel extends BaseModel {
    username: string;
    id: number;
    token: string;
    refreshToken: string;
    expiresDate: string;
}