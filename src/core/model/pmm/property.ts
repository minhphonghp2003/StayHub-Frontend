interface BaseModel {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CategoryItem extends BaseModel {
    name?: string;
    code?: string;
    description?: string;
}

export interface Property extends BaseModel {
    name?: string;
    address?: string;
    type?: CategoryItem;
    image?: string;
    startSubscriptionDate?: Date;
    endSubscriptionDate?: Date;
    subscriptionStatus?: CategoryItem;
    lastPaymentDate?: Date;
    tier?: CategoryItem;
    tierId?: number;
    wardId?: number;
    provinceId?: number;
}
