interface BaseModel {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Tier extends BaseModel {
    name?: string;
    description?: string;
    code?: string;
    price?: number;
    billingCycle?: string;
}
