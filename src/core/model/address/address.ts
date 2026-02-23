interface BaseModel {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Province extends BaseModel {
    name?: string;
    code?: string;
}

export interface Ward extends BaseModel {
    name?: string;
    code?: string;
}
