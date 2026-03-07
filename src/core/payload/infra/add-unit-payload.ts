export interface AddUnitPayload {
    name: string;
    basePrice: number;
    maximumCustomer: number;
    isActive: boolean;
    unitGroupId: number;
    propertyId: number;
}