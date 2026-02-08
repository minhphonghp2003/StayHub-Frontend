export interface ForgetPasswordPayload {
    email: string;
}

export interface NewPasswordPayload {
    password: string;
    token: string;
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}

export interface ChangeTenantPasswordPayload {
    userId: number;
    newPassword: string;
}