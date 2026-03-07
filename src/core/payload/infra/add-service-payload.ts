export interface AddServicePayload {
    name: string;
    unitTypeId: number;
    price: number;
    propertyId: number;
    isActive: boolean;
    description?: string;
}