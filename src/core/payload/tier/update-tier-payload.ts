export interface UpdateTierPayload {
    name: string;
    description?: string;
    code?: string;
    price: number;
    billingCycle: string;
}
