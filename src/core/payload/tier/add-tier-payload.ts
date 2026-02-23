export interface AddTierPayload {
    name: string;
    description?: string;
    code?: string;
    price: number;
    billingCycle: string;
}
