export interface AddPropertyPayload {
    name: string;
    address?: string;
    typeId: number;
    image?: string;
    startSubscriptionDate?: Date;
    endSubscriptionDate?: Date;
    lastPaymentDate?: Date;
    tierId: number;
    wardId?: number;
    provinceId?: number;
}
